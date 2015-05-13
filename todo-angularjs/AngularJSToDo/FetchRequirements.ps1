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

#Angular
InstallPreReqs "scripts\frameworks\angular.min.js" "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js" "AngularJs dependencies"
InstallPreReqs "scripts\frameworks\angular-resource.min.js" "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular-resource.min.js" "AngularJs dependencies"

#cleanup
Cleanup; 