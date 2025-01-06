<#
.SYNOPSIS
Remove local git branches that are deleted from the origin.

.DESCRIPTION
Removes local git branches that are deleted from the origin using `git fetch --prune` and `git branch -[dD]`.

.PARAMETER Force
Switch to to force removal using `git branch -D` instead of `git branch -d`.

.EXAMPLE
Remove-DeletedGitBranches
Removes merged non-existing branches.

.EXAMPLE
Remove-DeletedGitBranches -Force
Removes all non-existing branches.

.NOTES
This cmdlet uses `git fetch --prune`, so it will delete references to non-existing branches in the process. Use with caution.
#>
"I am a PowerShell script"
function Remove-DeletedGitBranches
{
    param
    (
        [Parameter()]
        [Switch]
        $Force
    )

    $null = (git fetch --all --prune);
    $branches = git branch -vv | Select-String -Pattern ": gone]" | ForEach-Object { $_.toString().Split(" ")[2] };
    if($Force)
    {
        $branches | ForEach-Object {git branch -D $_};
    }
    else 
    {        
        $branches | ForEach-Object {git branch -d $_};        
    }
}

# Set-Alias -Name "rmdelbr" -Value Remove-DeletedGitBranches

Remove-DeletedGitBranches