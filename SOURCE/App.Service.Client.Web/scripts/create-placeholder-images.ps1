# Quick Placeholder Image Creator
# Creates simple placeholder images to unblock development

Write-Host "=== Creating Placeholder Images ===" -ForegroundColor Cyan
Write-Host ""

# Create directories
$dirs = @(
    "App.Service.Client.Web/src/apps.bootstrap/assets/media/open/images/logos",
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/intro",
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/demos",
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/logos"
)

foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    } else {
        Write-Host "📁 Directory exists: $dir" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Downloading Placeholder Images ===" -ForegroundColor Cyan
Write-Host ""

# Download placeholders from placeholder.com
$placeholders = @{
    "App.Service.Client.Web/src/apps.bootstrap/assets/media/open/images/logos/logo-dark.png" = "https://via.placeholder.com/100x17/333333/ffffff?text=BASE"
    "App.Service.Client.Web/src/apps.bootstrap/assets/media/open/images/logos/logo-light.png" = "https://via.placeholder.com/100x17/ffffff/333333?text=BASE"
    "App.Service.Client.Web/src/apps.bootstrap/assets/media/open/images/logos/logo-sm.png" = "https://via.placeholder.com/22x22/333333/ffffff?text=B"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/demos/default.png" = "https://via.placeholder.com/800x600/eeeeee/333333?text=Demo+Screenshot"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/demos/saas.png" = "https://via.placeholder.com/800x600/e3f2fd/1976d2?text=SaaS+Demo"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/demos/material.png" = "https://via.placeholder.com/800x600/f3e5f5/7b1fa2?text=Material+Demo"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/demos/minimal.png" = "https://via.placeholder.com/800x600/fafafa/212121?text=Minimal+Demo"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/demos/creative.png" = "https://via.placeholder.com/800x600/fff3e0/e65100?text=Creative+Demo"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/intro/img-pattern.png" = "https://via.placeholder.com/1920x1080/f5f5f5/cccccc?text=Background+Pattern"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/logos/logo-dark.png" = "https://via.placeholder.com/100x17/333333/ffffff?text=BASE"
    "App.Service.Client.Web/src/sites.anon/assets/deployed/images/pages/home/logos/logo-light.png" = "https://via.placeholder.com/100x17/ffffff/333333?text=BASE"
}

$successCount = 0
$failCount = 0

foreach ($file in $placeholders.Keys) {
    try {
        if (!(Test-Path $file)) {
            Invoke-WebRequest -Uri $placeholders[$file] -OutFile $file -ErrorAction Stop
            Write-Host "✅ Downloaded: $file" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "⏭️  Already exists: $file" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Failed to download: $file" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✅ Successfully downloaded: $successCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "❌ Failed: $failCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "🎉 Placeholder images created!" -ForegroundColor Green
Write-Host "💡 Tip: Replace these with proper images when available" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: ng serve" -ForegroundColor White
Write-Host "2. Check: http://localhost:4200" -ForegroundColor White
Write-Host "3. Verify: No 404 errors in DevTools" -ForegroundColor White
