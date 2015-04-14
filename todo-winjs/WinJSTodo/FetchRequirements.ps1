## Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

param([string]$ProjectRoot = $PsScriptRoot)

$zipsCache = @{};
$exitCode = 0;
function Cleanup()
{
    try
    {
        foreach ($extractedZip in $zipsCache.Values)
        {
            Remove-Item -Recurse -Force $extractedZip;
        }
    }
    catch [System.Exception]
    {
        Write-Host $_;
    }
}

function InstallPreReqs($RelativePath, $httpSource, $description = "")
{
    try
    {
        $destinationPath = [System.IO.Path]::Combine($ProjectRoot, $RelativePath);
        if (Test-Path $destinationPath)
        {
            return;
        }

        if (!$httpSource -Or (!$httpSource.StartsWith("http://") -And !$httpSource.StartsWith("https://")))
        {
            Write-Host "Invalid Path $httpSource";
            return;
        }

        $filename = [System.IO.Path]::GetFileName($RelativePath);
        if (!$description)
        {
            $description = $filename;
        }

        Write-Host "Fetching $description from $httpSource ...";

        $parentDirectory = [System.IO.Path]::GetDirectoryName($destinationPath)
        if (!(Test-Path $parentDirectory))
        {
            New-Item -Path $parentDirectory -ItemType directory | Out-Null
        }

        if ([System.IO.Path]::GetExtension(([Uri]$httpSource).LocalPath) -ne ".zip")
        {
            (New-Object System.Net.WebClient).DownloadFile($httpSource, $destinationPath);
        }
        else
        {
            $extractedZipTempPath = $zipsCache[$httpSource];
            if (!$extractedZipTempPath)
            {
                $zipDestinationTempPath = [System.IO.Path]::GetTempFileName();
                (New-Object System.Net.WebClient).DownloadFile($httpSource, $zipDestinationTempPath);

                $extractedZipTempPath = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.IO.Path]::GetRandomFileName());

                Add-Type -As System.IO.Compression.FileSystem; 
                [System.IO.Compression.ZipFile]::ExtractToDirectory($zipDestinationTempPath, $extractedZipTempPath);
                $zipsCache.Add($httpSource, $extractedZipTempPath);
            }

            foreach ($file in (Get-ChildItem -r $extractedZipTempPath))
            {
                if ($file.Name -eq  $filename)
                {
                    Copy-Item $file.FullName $destinationPath;
                }
            }
        }

        if (!(Test-Path $destinationPath))
        {
            Write-Host "Failed to fetch $filename from $httpSource";
        }

    }
    catch [System.Exception]
    {
        Write-Host "Failed to fetch $filename from $httpSource (`"$_`")";
        $exitCode = 1;
    }
}

#WinJS
InstallPreReqs "www\scripts\frameworks\base.min.js" "http://cdnjs.cloudflare.com/ajax/libs/winjs/3.0.1/js/base.min.js" "WinJS dependencies"
InstallPreReqs "www\scripts\frameworks\ui.min.js" "http://cdnjs.cloudflare.com/ajax/libs/winjs/3.0.1/js/ui.min.js"    "WinJS dependencies"
InstallPreReqs "www\css\ui-dark.css" "http://cdnjs.cloudflare.com/ajax/libs/winjs/3.0.1/css/ui-dark.css"    "WinJS dependencies"
InstallPreReqs "www\css\ui-light.css" "http://cdnjs.cloudflare.com/ajax/libs/winjs/3.0.1/css/ui-light.css"    "WinJS dependencies"

#cleanup
Cleanup;