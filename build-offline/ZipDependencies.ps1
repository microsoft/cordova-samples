param (
    [string]$directoryToZip = $(throw "-directoryToZip is required."),
    [string]$destination = $(throw "-destination is required."),
    [string]$sevenZip = $(throw "-sevenZip is required.")
)
$destinationFile = $destination + "BuildOffline.zip"
If (Test-Path $destinationFile){
    Remove-Item $destinationFile
}
$cmd = '& ' + $sevenZip + 'a ' + $destinationFile + ' ' + $directoryToZip
Invoke-Expression $cmd