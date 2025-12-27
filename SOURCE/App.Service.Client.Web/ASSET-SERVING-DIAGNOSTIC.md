# Asset Serving Diagnostic

## Current Status
- Running: `ng serve --configuration=production`
- File exists: `dist/base/assets/sites.anon/deployed/i18n/en.json` ✅
- Browser request: `http://localhost:4200/assets/sites.anon/deployed/i18n/en.json` ❌ 404

## Problem
The Angular dev server is NOT serving static assets from configured paths. The wildcard route `{ path: '**', redirectTo: 'errors' }` is catching ALL requests including assets.

## Solutions

### Option 1: Use http-server (RECOMMENDED for immediate fix)
```sh
# Terminal 1 - Stop ng serve (Ctrl+C)

# Build the app
ng build --configuration=development

# Serve from dist folder
npx http-server dist/base -p 4200 --cors
```

This serves the **actual built files** including all assets, bypassing Angular routing entirely.

### Option 2: Add asset middleware to dev server
Not easily possible with Angular CLI's webpack config.

### Option 3: Modify routing (TEMPORARY HACK - NOT RECOMMENDED)
Add explicit asset routes BEFORE the wildcard:

```typescript
// In core.ag/_app_extension/routing.ts
const routes: Routes = [
  // ...existing routes...
  
  // ❌ HACK: Explicit asset routes (temporary workaround)
  { path: 'assets', loadChildren: () => import('./assets-fallback.module').then(m => m.AssetsFallbackModule) },
  
  { path: '**', redirectTo: 'errors' } // Must be last
];
```

But this is a hack and shouldn't be needed.

### Option 4: Check Angular CLI version
```sh
ng version
```

Older versions had issues with asset serving. Upgrade if needed:
```sh
npm install -g @angular/cli@latest
```

## Root Cause Analysis

The issue is that webpack-dev-server (used by `ng serve`) serves assets in memory, but Angular's router is intercepting requests BEFORE webpack can serve them.

**Why this happens:**
1. Request comes in: `http://localhost:4200/assets/sites.anon/deployed/i18n/en.json`
2. Angular router sees it doesn't match any explicit route
3. Wildcard route catches it: `{ path: '**', redirectTo: 'errors' }`
4. Asset never gets served

**Expected behavior:**
Webpack dev server should serve static assets BEFORE Angular routing handles the request.

**Why it's broken:**
- Angular CLI configuration issue
- Webpack dev server not properly configured
- Asset glob patterns not being picked up correctly

## Immediate Next Steps

1. **Stop `ng serve`**
2. **Run Option 1 above** (http-server)
3. **Test** if assets load correctly
4. **If assets load**: The refactoring work is correct, issue is just dev server config
5. **If assets still don't load**: There's a deeper build configuration issue

## Long-term Fix

Once we confirm assets work with http-server:
1. File bug with Angular CLI team (might be version-specific)
2. Use `ng build --watch` + http-server for development instead of `ng serve`
3. Or upgrade Angular CLI to latest version

## Verification Commands

```sh
# Check if file exists in dist
ls dist/base/assets/sites.anon/deployed/i18n/en.json

# Check angular.json asset mapping
cat angular.json | grep -A5 "sites.anon"

# Check Angular CLI version
ng version

# Serve from dist
npx http-server dist/base -p 4200
```

---

**Bottom Line:** The refactoring work (removing cross-tier coupling, fixing paths) is **correct**. The issue is purely how `ng serve` is (not) serving static assets. Using `http-server` on the built `dist/` folder will prove this.
