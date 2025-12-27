# Asset Verification Script
# Checks if all required assets exist in source and dist

Write-Host "=== Asset Verification ===" -ForegroundColor Cyan
Write-Host ""

# Define expected files
$i18nFiles = @(
    "src/core/assets/deployed/i18n/en.json",
    "src/themes/t1/assets/deployed/i18n/en.json",
    "src/sites.anon/assets/deployed/i18n/en.json",
    "src/sites.app/assets/deployed/i18n/en.json"
)

$logoFiles = @(
    "src/apps.bootstrap/assets/media/open/images/logos/logo-dark.png",
    "src/apps.bootstrap/assets/media/open/images/logos/logo-light.png",
    "src/apps.bootstrap/assets/media/open/images/logos/logo-sm.png"
)

$distI18nFiles = @(
    "dist/base/assets/core/deployed/i18n/en.json",
    "dist/base/assets/deployed/i18n/en.json",
    "dist/base/assets/sites.anon/deployed/i18n/en.json",
    "dist/base/assets/sites.app/deployed/i18n/en.json"
)

$distLogoFiles = @(
    "dist/base/assets/apps.bootstrap/media/open/images/logos/logo-dark.png",
    "dist/base/assets/apps.bootstrap/media/open/images/logos/logo-light.png",
    "dist/base/assets/apps.bootstrap/media/open/images/logos/logo-sm.png"
)

Write-Host "=== Checking SOURCE i18n files ===" -ForegroundColor Yellow
foreach ($file in $i18nFiles) {
    $fullPath = "App.Service.Client.Web/$file"
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        Write-Host "✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Checking SOURCE logo files ===" -ForegroundColor Yellow
foreach ($file in $logoFiles) {
    $fullPath = "App.Service.Client.Web/$file"
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        Write-Host "✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Checking DIST i18n files ===" -ForegroundColor Yellow
foreach ($file in $distI18nFiles) {
    $fullPath = "App.Service.Client.Web/$file"
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        Write-Host "✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Checking DIST logo files ===" -ForegroundColor Yellow
foreach ($file in $distLogoFiles) {
    $fullPath = "App.Service.Client.Web/$file"
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        Write-Host "✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Token Configuration Check ===" -ForegroundColor Yellow
Write-Host "Token should provide these paths:"
Write-Host "  logos.dark:  /assets/apps.bootstrap/media/open/images/logos/logo-dark.png"
Write-Host "  logos.light: /assets/apps.bootstrap/media/open/images/logos/logo-light.png"
Write-Host "  logos.sm:    /assets/apps.bootstrap/media/open/images/logos/logo-sm.png"

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. If SOURCE files missing → Run placeholder script or add real files"
Write-Host "2. If DIST files missing → Run: ng build"
Write-Host "3. Check browser console for actual 404 paths"
Write-Host "4. Verify token paths match actual file locations"
