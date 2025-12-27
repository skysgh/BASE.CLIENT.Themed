# Create placeholder logo directories with correct structure for Azure Blob Storage

$basePath = "Z:\S\Unsynced\REPOS\BASE.Client.Themed\SOURCE\App.Service.Client.Web\src"
$sourceLogo = "$basePath\apps.bootstrap\assets\media\open\images\logos"
$accounts = @("default", "foo", "bar")

foreach ($account in $accounts) {
    # Open media (public blob container)
    $targetPathOpen = "$basePath\core\assets\media\open\accounts\$account"
    
    if (-not (Test-Path $targetPathOpen)) {
        New-Item -ItemType Directory -Force -Path $targetPathOpen | Out-Null
        Write-Host "Created: $targetPathOpen" -ForegroundColor Green
    }
    
    Copy-Item "$sourceLogo\*" -Destination $targetPathOpen -Force
    Write-Host "Copied public logos to open/accounts/$account" -ForegroundColor Cyan
    
    # Sensitive media (private blob container)
    $targetPathSensitive = "$basePath\core\assets\media\sensitive\accounts\$account"
    
    if (-not (Test-Path $targetPathSensitive)) {
        New-Item -ItemType Directory -Force -Path $targetPathSensitive | Out-Null
        Write-Host "Created: $targetPathSensitive" -ForegroundColor Green
    }
    
    Write-Host "Created sensitive media folder for $account" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done! Logo structure created to match Azure Blob Storage containers:" -ForegroundColor Green
Write-Host "  - media/open/accounts/*      (public container)" -ForegroundColor Cyan
Write-Host "  - media/sensitive/accounts/* (private container)" -ForegroundColor Yellow
