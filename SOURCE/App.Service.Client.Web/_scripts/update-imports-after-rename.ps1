# PowerShell Script: Update Imports After Folder Rename
# Run this AFTER renaming folders with number prefixes

$sourceRoot = "Z:\S\Unsynced\REPOS\BASE.Client.Themed\SOURCE\App.Service.Client.Web\src"

# Define replacements (old path → new path)
$replacements = @{
    "from 'core/" = "from '1.core/"
    "from `"core/" = "from `"1.core/"
    "from '../core/" = "from '../1.core/"
    "from '../../core/" = "from '../../1.core/"
    "from '../../../core/" = "from '../../../1.core/"
    "from '../../../../core/" = "from '../../../../1.core/"
    "from '../../../../../core/" = "from '../../../../../1.core/"
    
    "from 'core.ag/" = "from '2.core.ag/"
    "from `"core.ag/" = "from `"2.core.ag/"
    "from '../core.ag/" = "from '../2.core.ag/"
    "from '../../core.ag/" = "from '../../2.core.ag/"
    "from '../../../core.ag/" = "from '../../../2.core.ag/"
    
    "from 'themes/" = "from '3.themes/"
    "from `"themes/" = "from `"3.themes/"
    "from '../themes/" = "from '../3.themes/"
    "from '../../themes/" = "from '../../3.themes/"
    "from '../../../themes/" = "from '../../../3.themes/"
    
    "from 'sites/" = "from '4.sites/"
    "from `"sites/" = "from `"4.sites/"
    "from '../sites/" = "from '../4.sites/"
    "from '../../sites/" = "from '../../4.sites/"
    "from '../../../sites/" = "from '../../../4.sites/"
    
    "from 'apps/" = "from '5.apps/"
    "from `"apps/" = "from `"5.apps/"
    "from '../apps/" = "from '../5.apps/"
    "from '../../apps/" = "from '../../5.apps/"
    "from '../../../apps/" = "from '../../../5.apps/"
    
    "from 'apps.main/" = "from '6.apps.main/"
    "from `"apps.main/" = "from `"6.apps.main/"
    "from '../apps.main/" = "from '../6.apps.main/"
    "from '../../apps.main/" = "from '../../6.apps.main/"
    
    "from 'apps.lets/" = "from '7.apps.lets/"
    "from `"apps.lets/" = "from `"7.apps.lets/"
    "from '../apps.lets/" = "from '../7.apps.lets/"
}

Write-Host "Updating imports in TypeScript files..." -ForegroundColor Cyan

# Get all TypeScript files
$files = Get-ChildItem -Path $sourceRoot -Include *.ts,*.tsx -Recurse

$totalFiles = $files.Count
$updatedFiles = 0
$currentFile = 0

foreach ($file in $files) {
    $currentFile++
    Write-Progress -Activity "Updating imports" -Status "Processing $($file.Name)" -PercentComplete (($currentFile / $totalFiles) * 100)
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Apply all replacements
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updatedFiles++
        Write-Host "✓ Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Progress -Activity "Updating imports" -Completed
Write-Host "`n✅ Complete! Updated $updatedFiles out of $totalFiles files." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run 'ng build' to verify no compilation errors"
Write-Host "2. Test the application"
Write-Host "3. Commit changes to Git"
