# Sites.App.Parts Folder Structure Convention

## Overview

This document defines the canonical folder structure for `sites.app.parts/` modules.
Each app.part is a platform feature module (Help, Support, FAQ, Hub, etc.).

## Canonical Structure

```
sites.app.parts/
├── {part-name}/                    # e.g., hub, support, faq, diagnostics
│   ├── README.md                   # Part documentation
│   │
│   ├── constants/                  # Static values, enums, config
│   │   ├── {part}.constants.ts
│   │   └── index.ts
│   │
│   ├── models/                     # Data models
│   │   ├── {entity}.dto.ts         # Wire format (API response)
│   │   ├── {entity}.view-model.ts  # UI format
│   │   └── index.ts
│   │
│   ├── mappers/                    # DTO ↔ ViewModel transformations
│   │   ├── {entity}.mapper.ts
│   │   └── index.ts
│   │
│   ├── repositories/               # Data access (HTTP, cache)
│   │   ├── {entity}.repository.ts
│   │   └── index.ts
│   │
│   ├── services/                   # Business logic
│   │   ├── {entity}.service.ts
│   │   └── index.ts
│   │
│   ├── brokers/                    # Card brokers (for Universal Search)
│   │   ├── {entity}-card.broker.ts
│   │   └── index.ts
│   │
│   ├── ui/                         # ✅ UI FOLDER - All visual components
│   │   │
│   │   ├── views/                  # Routable page components
│   │   │   ├── {part}-hub/         # Entry point hub (index of part)
│   │   │   │   └── component.ts
│   │   │   ├── browse/             # BREAD - Browse view
│   │   │   │   └── component.ts
│   │   │   ├── read/               # BREAD - Read view
│   │   │   │   └── component.ts
│   │   │   ├── edit/               # BREAD - Edit view
│   │   │   │   └── component.ts
│   │   │   ├── add/                # BREAD - Add view
│   │   │   │   └── component.ts
│   │   │   └── admin/              # Admin-only views
│   │   │       ├── {entity}-browse/
│   │   │       └── {entity}-edit/
│   │   │
│   │   ├── widgets/                # Embeddable summary cards
│   │   │   ├── {part}-summary/     # Hub widget
│   │   │   │   └── component.ts
│   │   │   └── {stat}-count/       # Stat widgets
│   │   │       └── component.ts
│   │   │
│   │   ├── pages/                  # Full-page layouts (rare)
│   │   │   └── {page-name}/
│   │   │       └── component.ts
│   │   │
│   │   └── features/               # Complex multi-component features (rare)
│   │       └── {feature-name}/
│   │           ├── components/
│   │           ├── services/
│   │           └── module.ts
│   │
│   ├── domain/                     # Domain models (reference data)
│   │   └── reference-data/
│   │       └── {entity}-status.model.ts
│   │
│   ├── module.ts                   # Angular module
│   ├── routing.ts                  # Module routes (optional)
│   └── index.ts                    # Public API exports
```

## Folder Definitions

### `ui/views/`
**Purpose**: Routable components that represent full pages in the app.

| View Type | Convention | Example |
|-----------|------------|---------|
| Hub/Index | `{part}-hub/` | `support-hub/`, `faq-hub/` |
| Browse | `browse/` or `{entity}-browse/` | `browse/`, `item-browse/` |
| Read | `read/` or `{entity}-read/` | `read/`, `item-read/` |
| Edit | `edit/` or `{entity}-edit/` | `edit/`, `item-edit/` |
| Add | `add/` or `{entity}-add/` | `add/`, `item-add/` |
| Admin | `admin/{entity}-{action}/` | `admin/category-browse/` |

### `ui/widgets/`
**Purpose**: Embeddable summary components for use in Hub or other dashboards.

Widgets are:
- Self-contained (fetch own data)
- Clickable (navigate to full view)
- Responsive
- Small (show summary, not detail)

### `ui/pages/`
**Purpose**: Full-page layouts (rare - use sparingly).

Only use when a page needs special layout that doesn't fit views.

### `ui/features/`
**Purpose**: Complex multi-component features (rare).

Only use when a feature has multiple tightly-coupled components with their own services.

## Example: Support Part

```
sites.app.parts/support/
├── README.md
├── constants/
│   ├── support.constants.ts
│   └── index.ts
├── models/
│   ├── support-item.dto.ts
│   ├── support-item.view-model.ts
│   └── index.ts
├── mappers/
│   ├── support-item.mapper.ts
│   └── index.ts
├── repositories/
│   ├── support-item.repository.ts
│   └── index.ts
├── services/
│   ├── support-item.service.ts
│   └── index.ts
├── brokers/
│   ├── support-item-card.broker.ts
│   └── index.ts
├── ui/
│   ├── views/
│   │   ├── support-hub/
│   │   │   └── component.ts
│   │   ├── item-browse/
│   │   │   └── component.ts
│   │   ├── item-read/
│   │   │   └── component.ts
│   │   ├── item-add/
│   │   │   └── component.ts
│   │   └── item-edit/
│   │       └── component.ts
│   └── widgets/
│       └── support-summary/
│           └── component.ts
├── module.ts
├── routing.ts
└── index.ts
```

## Migration Plan

When refactoring existing parts:

1. Create `ui/` folder
2. Move `views/` into `ui/views/`
3. Move `widgets/` into `ui/widgets/`
4. Update imports in module.ts
5. Verify build compiles
6. Test routing still works

## Why This Structure?

1. **Consistency**: All parts follow same pattern
2. **Discoverability**: Easy to find components
3. **Separation**: UI separate from business logic
4. **BREAD Pattern**: Clear mapping of views to actions
5. **Scalability**: Features folder for complex scenarios
6. **Theme-Agnostic**: UI folder contains all visual components

## Current Status (as of 2026-01-01)

| Part | Has `ui/` folder | Notes |
|------|------------------|-------|
| hub | ❌ | Needs migration |
| support | ❌ | Has views/, needs ui/ wrapper |
| faq | ❌ | Has views/, needs ui/ wrapper |
| diagnostics | ❌ | Has views/ and widgets/ |
| access | ❌ | Has views/ and widgets/ |
| help | ❌ | Has views/ |
| authentication | ❌ | Has submodules with views/ |

## Next Steps

1. Start with new parts using canonical structure
2. Migrate existing parts incrementally as we touch them
3. Use this document as reference
