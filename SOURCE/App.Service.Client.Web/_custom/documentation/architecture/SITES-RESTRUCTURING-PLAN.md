# Sites Tier Restructuring Plan

**Date**: 2025-12-26  
**Status**: 📋 Planning  
**Goal**: Split monolithic `sites/` tier into separate tiers for anonymous and authenticated experiences

---

## Executive Summary

**Current Problem**: 
The `sites/` tier mixes public marketing pages with authenticated app features, creating:
- Mixed security boundaries (public + private in same tier)
- Unclear lazy-loading strategy (what loads when?)
- Confusing navigation (landing pages mixed with dashboards)

**Proposed Solution**:
Split into **three separate tiers** with clear boundaries:

```
sites.anon/         ← Anonymous visitors (public marketing, no auth)
sites.app/          ← Authenticated application (protected)
sites.app.lets/     ← Mini-apps within app (modular features)
```

---

## Naming Strategy: Anon/App

### Why This Naming?

**Considered Options**:
| Option | Public Tier | Private Tier | Alphabetical? | Clarity |
|--------|-------------|--------------|---------------|---------|
| A | `sites.0.anon/` | `sites.1.app/` | ✅ | ⚠️ Numbers feel hacky |
| **B** | **`sites.anon/`** | **`sites.app/`** | **✅** | **✅ Clear security model** |
| C | `sites.external/` | `sites.internal/` | ❌ | ✅ Professional but wrong order |
| D | `sites.guest/` | `sites.member/` | ✅ | ⚠️ Assumes membership model |
| E | `sites.open/` | `sites.app/` | ❌ | ⚠️ 'app' < 'open' (wrong order) |

**Selected: Option B - Anon/App** ✅

**Benefits**:
- ✅ **Alphabetically Correct**: `anon` < `app` (correct load order!)
  - Both start with 'a', but 'n' comes before 'p' ✅
- ✅ **Clear Security Model**: Anon = no auth, App = auth required
- ✅ **Scalable**: `app.lets` naturally follows `app`
- ✅ **Concise**: Short names (anon = 4 chars, app = 3 chars)
- ✅ **Common Term**: "Anon" widely understood in web dev (anonymous users)

---

## Current vs. Proposed Structure

### Current (Monolithic):
```
sites/
  constants/
  configuration/
  features/
    pages/
      landing/         ← Public (no auth)
      pricing/         ← Public
      information/     ← Public (about, privacy)
      dashboard/       ← Private (needs auth) ❌ MIXED!
  module.ts
  routing.ts
```

**Problems**:
- ❌ Public and private pages in same tier
- ❌ Can't protect entire tier with `AuthGuard` (would block landing page)
- ❌ Can't lazy-load separately (marketing site loads with app)
- ❌ Routing complex (mix of guarded and unguarded routes)

---

### Proposed (Separated):

#### **Tier 1: sites.anon/**
```
sites.anon/
  constants/
    implementations/
      sites.anon.constants.ts
  configuration/
    implementations/
      sites.anon.configuration.ts
  features/
    landing/                    ← Marketing homepage
      components/
        hero/
        features/
        testimonials/
    pricing/                    ← Pricing page
    information/                ← Static pages
      about/
      privacy/
      terms/
  module.ts
  routing.module.ts
```

**Characteristics**:
- ✅ **No Authentication**: Entire tier is public
- ✅ **Fast Loading**: Minimal bundle (marketing only)
- ✅ **SEO Optimized**: Public pages for search engines

---

#### **Tier 2: sites.app/**
```
sites.app/
  constants/
    implementations/
      sites.app.constants.ts
  configuration/
    implementations/
      sites.app.configuration.ts
  features/
    dashboard/                  ← Main dashboard
      widgets/
      analytics/
    reports/                    ← Reporting features
      sales/
      inventory/
    settings/                   ← App settings
      profile/
      preferences/
  module.ts
  routing.module.ts
```

**Characteristics**:
- ✅ **Fully Protected**: `AuthGuard` on entire tier
- ✅ **Lazy Loaded**: Only loads after login
- ✅ **App Shell**: Container for authenticated features

---

#### **Tier 3: sites.app.lets/**
```
sites.app.lets/
  education/                    ← Education mini-app
    constants/
    configuration/
    features/
      courses/
      lessons/
      quizzes/
    module.ts
    routing.module.ts
  
  scheduling/                   ← Scheduling mini-app
    constants/
    configuration/
    features/
      calendar/
      appointments/
      resources/
    module.ts
    routing.module.ts
```

**Characteristics**:
- ✅ **Modular**: Each applet is independent
- ✅ **Lazy Loaded**: Load on-demand (not at app start)
- ✅ **Protected**: Inherit auth from parent (`sites.app/`)
- ✅ **Pluggable**: Add/remove applets without affecting core app

---

## Final Tier Structure

### Complete Architecture:
```
core/                   ← Foundation
core.ag/                ← Angular utilities
themes/
  themes.t1/            ← UI theme
    components.common/  ← Shared: footer, header, errors

sites.anon/             ← 🆕 Anonymous/public marketing
sites.app/              ← 🆕 Authenticated application  
sites.app.lets/         ← 🆕 Mini-apps/applets
  education/
  scheduling/

system/                 ← System config (renamed from apps/)
```

### Alphabetical Load Order (Verified):
```
core/           (c)
core.ag/        (c.a)
sites.anon/     (s.a.n) ← Loads first (public) ✅
sites.app/      (s.a.p) ← Loads second (auth) ✅
sites.app.lets/ (s.a.p.l) ← Loads third (applets) ✅
system/         (s.y)
themes/         (t)
```

Perfect alphabetical ordering! ✅

---

## URL Structure

### After (Clear):
```
URL Path                        Tier                        Auth Required?
─────────────────────────────────────────────────────────────────────────
/                               sites.anon/                 ❌ Public
/pricing                        sites.anon/pricing          ❌ Public
/about                          sites.anon/information      ❌ Public

/auth/login                     themes/t1/                  ❌ Auth flow

/app                            sites.app/                  ✅ Protected
/app/dashboard                  sites.app/dashboard         ✅ Protected
/app/reports                    sites.app/reports           ✅ Protected
/app/settings                   sites.app/settings          ✅ Protected

/app/education                  sites.app.lets/education/            ✅ Protected
/app/education/courses          sites.app.lets/education/courses     ✅ Protected
/app/scheduling                 sites.app.lets/scheduling/           ✅ Protected
```

---

## Configuration Hierarchy

### sites.anon Configuration:
```typescript
// sites.anon/configuration/implementations/sites.anon.configuration.ts

export const sitesAnonConfiguration: TSitesAnonConfiguration = {
  id: 'sites.anon',
  
  description: {
    title: 'Company Name',
    description: 'Marketing site for anonymous visitors',
    purpose: 'Attract and convert leads'
  },
  
  constants: sitesAnonConstants,
  
  navigation: {
    header: {
      home: '/',
      pricing: '/pricing',
      about: '/about',
      login: '/auth/login'           // ← Links to themes tier
    }
  },
  
  branding: {
    logoPath: '/media/sites.anon/images/logos/',
    theme: 'marketing',              // Light, colorful
    primaryColor: '#3577f1'
  },
  
  // No 'others' - anon site is independent!
};
```

### sites.app Configuration:
```typescript
// sites.app/configuration/implementations/sites.app.configuration.ts

export const sitesAppConfiguration: TSitesAppConfiguration = {
  id: 'sites.app',
  
  description: {
    title: 'App Dashboard',
    description: 'Application for authenticated users',
    purpose: 'Provide app functionality'
  },
  
  constants: sitesAppConstants,
  
  navigation: {
    sidebar: {
      dashboard: '/app/dashboard',
      reports: '/app/reports',
      settings: '/app/settings',
      // Applets
      education: '/app/education',
      scheduling: '/app/scheduling'
    },
    topbar: {
      profile: '/app/settings/profile',
      logout: '/auth/logout'
    }
  },
  
  branding: {
    logoPath: '/media/sites.app/images/logos/',
    theme: 'application',            // Professional, neutral
    primaryColor: '#0ab39c'          // Different from marketing!
  },
  
  // Reference to applets (lazy-loaded)
  others: {
    applets: {
      education: () => import('../../sites.app.lets/education/configuration'),
      scheduling: () => import('../../sites.app.lets/scheduling/configuration')
    }
  }
};
```

---

## Shared Components Strategy

**Question**: Do we need a parent `sites/` tier for shared components?

**Answer**: **No** - shared components go in `themes/` instead!

### Realistic Shared Components:
1. **Footer** (appears on both anon and app pages)
2. **Header** (different variants, but shared structure)
3. **Error Pages** (404, 500, etc.)

### Where They Go:
```
themes/t1/
  components.common/
    footer/         ← Used by both sites.anon and sites.app
    header/         ← Different variants (anon vs app)
    error-pages/    ← 404, 500, etc.
```

**Usage**:
```typescript
// sites.anon component
import { FooterComponent } from '../../../themes/t1/components.common/footer';

// sites.app component  
import { FooterComponent } from '../../../themes/t1/components.common/footer';
```

**Benefits**:
- ✅ **Simpler Structure**: No parent `sites/` tier needed
- ✅ **Theme Ownership**: Presentational components belong in themes
- ✅ **No Path Redundancy**: Avoid `sites/sites.anon/`

---

_[Rest of the document continues with Routing, Migration Steps, etc. - same content as before but with anon/app naming]_

---

**Status**: 📋 Ready for Review & Approval  
**Next**: Check in current work, then plan Sites restructuring execution  
**Risk**: Medium (large refactor, but clear plan)

**Naming Decision**: `sites.anon/` + `sites.app/` ✅  
**Alphabetical**: Verified correct ✅  
**No Parent Tier**: Shared components go in `themes/` ✅
