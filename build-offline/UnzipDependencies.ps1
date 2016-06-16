param (
    [string]$filename = $(throw "-filename is required."),
    [string]$outputFolder = $(throw "-outputFolder is required."), 
    [string]$sevenZip = ""
)
if("" -ne $sevenZip){
    $cmd = '& ' + $sevenZip + 'x ' + $filename + ' ' + $outputFolder + ' -aoa'
    Invoke-Expression $cmd
}else{
    $shell_app=new-object -com shell.application
    $zip_file = $shell_app.namespace((Get-Location).Path + "\$filename")
    $destination = $shell_app.namespace((Get-Location).Path + "\$outputFolder")
    $destination.Copyhere($zip_file.items());
}