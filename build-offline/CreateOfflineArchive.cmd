@ECHO off

ECHO.
ECHO Tools for Apache Cordova Offline Build Archive Creator
ECHO ------------------------------------------------------
ECHO.

SET OutputDirectory=%1
SET SkipDownloadNodeNpm=%2
SET SevenZip=%3

IF [%OutputDirectory%]==[] goto INPUTERROR
IF [%SevenZip%]==[] SET SevenZip=%HomeDrive%\Program Files\7-Zip\7z.exe

SET BuildOfflineTempDir=%TEMP%\BuildOffline
SET DependenciesDir=%BuildOfflineTempDir%\Dependencies
SET NpmCacheSourceDir=%APPDATA%\npm-cache
SET NpmModulesSourceDir=%APPDATA%\npm\node_modules
IF /I "%robocopy%"=="" Set robocopy=robocopy /NJH /NJS
SET NugetPackageDir=..\..\NugetPackages\VS.ExternalAPIs.ApacheCordovaTools.external.dev15.1.0.16060601\BuildOffline

SET CordovaWindowsVersion=4.3.2
SET CordovaVersion=6.1.1
SET SandboxedNpmVersion=2.15.1
SET CordovaPluginWhitelistVersion=1

ECHO Cleaning up previous package...
:: ====================================================
IF exist "%BuildOfflineTempDir%" rmdir /s /q "%BuildOfflineTempDir%"

ECHO Clearing npm-cache...
:: ====================================================
IF exist "%NpmCacheSourceDir%" rmdir /s /q "%NpmCacheSourceDir%"

REM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
REM ADD PACKAGES YOU WANT TO INSTALL TO THIS LIST
REM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
ECHO Globally installing packages to establish npm-cache...
:: ====================================================
call npm install -g npm@%SandboxedNpmVersion%
call npm install -g ..\Packages\vs-tac15
call npm install -g cordova@%CordovaVersion%
call npm install -g cordova-windows@%CordovaWindowsVersion%
call npm install -g cordova-plugin-whitelist@%CordovaPluginWhitelistVersion%
call npm uninstall -g npm

ECHO Establishing temporary directory to create zip file...
:: ====================================================
mkdir %BuildOfflineTempDir%
mkdir %DependenciesDir%
mkdir %DependenciesDir%\npm-cache
mkdir %DependenciesDir%\lib\windows\cordova

ECHO Copying npm node_modules...
:: ====================================================
%robocopy% /E "%NpmModulesSourceDir%" "%DependenciesDir%\node_modules"

ECHO Copying npm-cache...
:: ====================================================
%robocopy% /E "%NpmCacheSourceDir%" "%DependenciesDir%\npm-cache"

ECHO Extracting Windows platform package...
:: ====================================================
"%SevenZip%" x "%DependenciesDir%\npm-cache\cordova-windows\%CordovaWindowsVersion%\package.tgz" -o"%OfflineBuildTempDir%\Package" -aoa
"%SevenZip%" x "%OfflineBuildTempDir%\Package\package.tar" -o"%OfflineBuildTempDir%\Package" -aoa

ECHO Copying Windows platform package...
:: ====================================================
%robocopy% /E "%OfflineBuildTempDir%\Package\package" "%DependenciesDir%\lib\windows\cordova\%CordovaWindowsVersion%"

ECHO Copying external dependencies...
:: ====================================================
IF "%SkipDownloadNodeNpm%" NEQ "1" (
	ECHO Downloading and copying Node and NPM...
	powershell -ExecutionPolicy Bypass -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v4.4.4/win-x86/node.exe', '%DependenciesDir%\node.exe')"
	powershell -ExecutionPolicy Bypass -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/npm/npm/archive/v%SandboxedNpmVersion%.zip', '%DependenciesDir%\npm-%SandboxedNpmVersion%.zip')"
) ELSE (
	Echo Skipping NPM and Node download...
	IF exist "%NugetPackageDir%" (
	%robocopy% /E "%NugetPackageDir%" "%DependenciesDir%"
	) ELSE (
		%robocopy% "%~dp0" "%DependenciesDir%" node.exe npm-%SandboxedNpmVersion%.zip
	)
)

ECHO Creating nodevars.bat...
:: ====================================================
(
	ECHO @echo off
	ECHO set PATH=%%APPDATA%%\npm;%%~dp0;%%PATH%%
	ECHO setlocal enabledelayedexpansion
	ECHO pushd ""%%~dp0""
	ECHO set print_version=.\node.exe -p -e "process.versions.node + ' (' + process.arch + ')'"
	ECHO for /F "usebackq delims=" %%%%v in (`%%print_version%%`^) do set version=%%%%v
	ECHO popd
	ECHO endlocal
	ECHO if "%%CD%%\"=="%%~dp0" cd /d "%%HOMEDRIVE%%%%HOMEPATH%%"
) > "%DependenciesDir%\nodevars.bat"

ECHO Creating BuildOffline.zip...
:: ====================================================
IF NOT EXIST "%OutputDirectory%" mkdir "%OutputDirectory%
powershell -ExecutionPolicy Bypass -File .\ZipDependencies.ps1 -directoryToZip "%DependenciesDir%" -destination "%OutputDirectory%\\" -sevenZip "%SevenZip%"

ECHO Done!
goto DONE

:INPUTERROR
ECHO There was an error with your input.
ECHO.
ECHO Usage: CreateOfflineArchive.cmd [OutputDirectory] [SkipDownloadNpmNode] [PathTo7Zip]
ECHO.
ECHO OutputDirectory (Required) - A path to a folder you'd like the package to be saved to.
ECHO SkipDownloadNodeNpm (Optional) - Pass 1 and copy node.exe and npm-%SandboxedNpmVersion%.zip to the same directory as the script to prevent them from being downloaded again.
ECHO PathTo7Zip (Optional) - A path to 7z.exe. If left empty, it will assume the default 64-bit install location.
ECHO.
ECHO.

:DONE
