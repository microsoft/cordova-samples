@ECHO off

ECHO.
ECHO Tools for Apache Cordova Offline Build Archive Extractor
ECHO --------------------------------------------------------
ECHO.

SET SevenZipDirectory=%1

SET CWD=%~dp0
SET DependenciesSourceDir=%CWD%Dependencies
SET NpmSourceDir=%DependenciesSourceDir%\npm
SET NpmModulesSourceDir=%DependenciesSourceDir%\node_modules
SET NpmCacheSourceDir=%DependenciesSourceDir%\npm-cache
SET CordovaCacheSourceDir=%DependenciesSourceDir%\lib

SET SandboxedNpmVersion=2.15.1
SET SandboxDestDir=%AppData%\Microsoft\VisualStudio\MDA\vs-npm\%SandboxedNpmVersion%
SET NpmModulesDestDir=%AppData%\npm\node_modules
SET NpmCacheDestDir=%AppData%\npm-cache
SET CordovaCacheDestDir=%HomePath%\.cordova\lib

if /I "%robocopy%"=="" SET robocopy=robocopy /NJH /NJS

ECHO Unzipping Dependencies...
:: ====================================================
mkdir %DependenciesSourceDir%
mkdir %NpmSourceDir%
powershell -ExecutionPolicy ByPass -File .\UnzipDependencies.ps1 -filename BuildOffline.zip -outputFolder "Dependencies" -sevenZip """%SevenZipDirectory%"""
powershell -ExecutionPolicy ByPass -File .\UnzipDependencies.ps1 -filename "Dependencies\npm-%SandboxedNpmVersion%.zip" -outputFolder "Dependencies\npm"

ECHO Sandboxing node and npm...
:: ====================================================
mkdir %SandboxDestDir%
%robocopy% "%DependenciesSourceDir%" "%SandboxDestDir%" node.exe nodevars.bat
%robocopy% /E "%NpmSourceDir%\npm-%SandboxedNpmVersion%" "%SandboxDestDir%\node_modules\npm"
%robocopy% "%NpmSourceDir%\npm-%SandboxedNpmVersion%\bin" "%SandboxDestDir%" npm npm.cmd
call "%SandboxDestDir%\npm.cmd" config SET prefix -g "${APPDATA}/npm"

ECHO Copying node_modules...
:: ====================================================
mkdir %NpmModulesDestDir%
%robocopy% /E "%NpmModulesSourceDir%" "%NpmModulesDestDir%"

ECHO Copying npm-cache...
:: ====================================================
mkdir %NpmCacheDestDir%
%robocopy% /E "%NpmCacheSourceDir%" "%NpmCacheDestDir%"

ECHO Copying Cordova Cache...
:: ====================================================
mkdir %CordovaCacheDestDir%
%robocopy% /E %CordovaCacheSourceDir% %CordovaCacheDestDir%

ECHO Done!