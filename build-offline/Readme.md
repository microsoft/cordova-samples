# README

This project contains a set of example scripts that let you take resource from a machine with internet access and deploy them to a target machine in order to create a limited offline Visual Studio + Cordova development environment.

## Usage
### CreateOfflineArchive.cmd  

This script should be run on a machine with internet access. It assumes you have Nodejs and 7zip installed. The script has the following output:
- BuildOffline.zip - An archive containing the dependencies needed to establish a limited offline development environment.
- ExtractOfflineArchive.cmd - A script that "installs" these dependencies (see below).
- UnzipDependencies.ps1 - A helper script used to extract the archive.

**Usage:** CreateOfflineArchive.cmd [OutputDirectory] [SkipDownloadNpmNode] [PathTo7Zip]

- **OutputDirectory (Required)** - A path to a folder you'd like the package to be saved to.  
- **SkipDownloadNodeNpm (Optional)** - Pass 1 and copy node.exe and npm-%SandboxedNpmVersion%.zip to the same directory as the script to prevent them from being downloaded again.  
- **PathTo7Zip (Optional)** - A path to 7z.exe or 7za.exe. If left empty, it will assume the default 64-bit install location.

### ExtractOfflineArchive.cmd

This script should be copied to a temporary directory along with the **BuildOffline.zip** and **UnzipDependencies.ps1**. Running the script will unpack the archive and copy the components into the locations needed to create a limited offline development environment.

**Usage:** ExtractOfflineArchive.cmd [PathTo7Zip]

- **PathTo7Zip (Optional)** - A path to 7z.exe or 7za.exe. If left empty, it will attempt to use the shell, which may fail if part of the archive breaks the Windows max file path limit.