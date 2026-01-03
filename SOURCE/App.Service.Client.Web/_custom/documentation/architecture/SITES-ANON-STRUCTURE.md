# sites.anon Structure

## Overview

`sites.anon` contains public-facing pages that don't require authentication.

## Target Structure

```
sites.anon/
├── assets/                    # Static assets
├── configuration/             # Site configuration
├── constants/                 # Constants
├── features/                  # Feature modules
│   ├── landing/               # Landing/marketing pages
│   │   ├── ui/
│   │   │   ├── pages/         # Full page components
│   │   │   │   ├── home/
│   │   │   │   ├── pricing/
│   │   │   │   ├── coming-soon/
│   │   │   │   └── opportunities/
│   │   │   └── widgets/       # Shared landing widgets
│   │   │       ├── header/
│   │   │       ├── features/
│   │   │       ├── testimonials/
│   │   │       ├── stats/
│   │   │       ├── team/
│   │   │       ├── cta/
│   │   │       └── footer/
│   │   ├── models/
│   │   ├── services/
│   │   ├── module.ts
│   │   └── routing.ts
│   │
│   ├── information/           # Legal/info pages
│   │   ├── ui/
│   │   │   └── pages/
│   │   │       ├── index/
│   │   │       ├── contact/
│   │   │       ├── privacy/
│   │   │       ├── terms/
│   │   │       ├── corrections/
│   │   │       └── support/
│   │   ├── models/
│   │   ├── services/
│   │   ├── module.ts
│   │   └── routing.ts
│   │
│   ├── auth-landing/          # Auth-related landing pages
│   │   ├── ui/
│   │   │   └── pages/
│   │   │       ├── signed-out/
│   │   │       └── session-expired/
│   │   ├── services/
│   │   ├── module.ts
│   │   └── routing.ts
│   │
│   ├── search/                # Public search (already migrated)
│   │   ├── ui/
│   │   │   └── views/
│   │   │       └── search/
│   │   ├── module.ts
│   │   └── routing.ts
│   │
│   ├── faq/                   # Public FAQ (if separate from landing)
│   │   ├── ui/
│   │   │   └── pages/
│   │   │       └── faq-page/
│   │   ├── models/
│   │   ├── services/
│   │   ├── module.ts
│   │   └── routing.ts
│   │
│   └── errors/                # Error pages (404, 500, etc.)
│       ├── ui/
│       │   └── pages/
│       │       ├── not-found/
│       │       ├── server-error/
│       │       └── maintenance/
│       ├── module.ts
│       └── routing.ts
│
├── module.ts                  # Root sites.anon module
└── routing.ts                 # Root routing
```

## Key Differences from Authenticated Sites

| Aspect | sites.anon | sites.app.* |
|--------|------------|-------------|
| UI folder | `ui/pages/` | `ui/views/` |
| Purpose | Full standalone pages | Views within layouts |
| Layout | Usually standalone | Within sidebar/topbar |
| Auth | None required | Requires auth |

## Current State (Before Migration)

The current structure uses `components/` instead of `ui/pages/`:
- `features/pages/landing/home/components/`
- `features/pages/information/components/`

This will be migrated incrementally to the new pattern.

## Migration Strategy

1. **Phase 1**: Create new folders with `ui/pages/` structure
2. **Phase 2**: Move components to new locations
3. **Phase 3**: Update imports and routing
4. **Phase 4**: Remove old empty folders

## Landing Page Widgets

The landing pages share many widget components (header sections, feature grids, testimonials, etc.). These are in:
- Current: `features/pages/landing/_sharedparts/components/`
- Target: `features/landing/ui/widgets/`

These widgets are composed to build different landing page variants.
