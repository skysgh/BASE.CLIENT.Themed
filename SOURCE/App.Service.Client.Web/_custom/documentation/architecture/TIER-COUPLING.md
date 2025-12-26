# Tier Coupling Documentation

## Overview
This document tracks intentional coupling between tiers where complete independence is impractical.

## Known Couplings

### 1. EnvConfigService → themesT1Configuration

**Location**: `core/services/env-config.service.ts`

**Coupling**: `EnvConfigService.getDeployedConfig()` imports `themesT1Configuration`

**Reason**: 
- EnvConfigService needs sensible defaults for fallback configuration
- Themes provide the baseline UX defaults (e.g., where to redirect after login)
- This is a **build-time** dependency, not runtime

**Why Acceptable**:
- EnvConfigService is infrastructure (sits below all application tiers)
- Only used for fallback when config.json is unavailable
- Can still be overridden at runtime via config.json
- Doesn't create circular dependency (one-way: core → themes)

**Alternative Considered**: 
Hard-coding defaults in EnvConfigService, but that would duplicate configuration knowledge and break single source of truth.

**Override Path**: 
Set `postLoginRedirect` in `/assets/data/env-config.json` to override the theme default without touching code.

---

### 2. themesT1Configuration → appsConfiguration (Branding Metadata - Build Time Only)

**Location**: `themes/t1/configuration/implementations/themes.t1.configuration.ts`

**Coupling**: Theme config imports app config ONCE to copy branding metadata

**Pattern**:
```typescript
// ✅ Import ONCE at module init (build time)
branding: (() => {
  const { appsConfiguration } = require('path/to/apps.configuration');
  return {
    logoPath: appsConfiguration.constants.resources.open.images.logos,
    appTitle: appsConfiguration.description.title,
    appDescription: appsConfiguration.description.description,
  };
})()
```

**What's Copied**:
- Logo path (e.g., `/media/apps/images/logos/`)
- App title (e.g., "My Application")
- App description (e.g., "A modern web application")

**Why Acceptable**:
- **One-time copy at build** (not component-level coupling)
- **No component upward coupling** - components use `tierConfig.branding`
- **Prevents duplication** - theme doesn't define its own branding
- **Clear ownership** - app owns branding, theme copies it

**Components Use**:
```typescript
// ✅ Component code (tier independent!)
export class LoginComponent {
  public tierConfig = themesT1Configuration;
}
```

```html
<!-- ✅ Template (simple, consistent) -->
<img [src]="tierConfig.branding.logoPath + 'logo-light.png'">
<h1>{{tierConfig.branding.appTitle}}</h1>
<p>{{tierConfig.branding.appDescription}}</p>
```

**Trade-offs**:
- ✅ Complete tier independence at component level
- ✅ Single config variable in templates (`tierConfig`)
- ✅ No component-level upward imports
- ⚠️ Slight duplication (branding exists in app + theme config)
- ⚠️ Build-time copy (changes need rebuild)

**Affected Components** (~10):
- Auth: `login`, `signin/basic`, `signin/cover`, `logout/basic`, `logout/cover`
- Layout: `topbar/logo`, `horizontal-topbar`, `two-column-sidebar`, `sidebar`
- Unused: `job-footer`

**Future Optimization**:
For lazy-loaded modules, could use getter that pulls from EnvConfigService:
```typescript
get branding() {
  const envConfig = inject(EnvConfigService).get();
  return envConfig.branding || defaultBranding;
}
```
Requires Angular 14+ `inject()` outside constructors.

---

## Tier Independence Guidelines

### General Rule
Each tier should prefer its own configuration:
- `core/` → `coreConfiguration`
- `themes/t1/` → `themesT1Configuration`  
- `sites/` → `sitesConfiguration`
- `apps/` → `appsConfiguration`

**Template Variable Pattern**:
Components expose tier config as `tierConfig` for template simplicity:
```typescript
export class MyComponent {
  // ✅ Consistent name across all tiers
  public tierConfig = themesT1Configuration;
}
```

### Exceptions (when cross-tier access is acceptable)
1. **Infrastructure services** (like EnvConfigService) pulling defaults from lower tiers
2. **Build-time metadata copy** (like branding) - ONCE at module init, not per-component
3. **Type definitions** shared across tiers (e.g., `TBaseConfiguration`)
4. **Constants** that are truly universal (e.g., HTTP status codes)

### Red Flags (avoid these)
- ❌ Component-level imports from other tiers
- ❌ Business logic in one tier calling services from another
- ❌ Components in lower tiers importing config from higher tiers
- ❌ Circular references between tier configurations

---

## Features vs Components Split (themes/t1)

### Structure
```
themes/t1/
  ├── components/        ← Dumb/Presentational (reusable widgets)
  └── features/          ← Smart/Container (routable pages)
```

### Rationale

**`components/`** - Reusable UI Elements
- No routes
- No business logic
- Input/Output only
- Examples: breadcrumbs, footers, stats cards

**`features/`** - Complete User Flows
- Have routing modules
- Manage state
- Call services
- Compose components
- Examples: login, error pages, user account flows

### Why Keep Separate?
1. **Clear Intent**: Feature = page, Component = widget
2. **Lazy Loading**: Features can be loaded on-demand
3. **Testing**: Easy to mock components in feature tests
4. **Team Workflow**: UI designers → components, Developers → features

### Decision: **Keep Separated** ✅

---

Last Updated: 2025-12-26
