# Sites Tier

**Foundational layer for all site implementations.**

## Architecture Position

```
src/
├── core/           → Pure TypeScript (no Angular dependencies)
├── core.ag/        → Angular infrastructure (guards, pipes, base widgets)
├── themes/         → Visual chrome (layout, topbar, sidebar, footer)
│
├── sites/          → THIS TIER: Shared site-level patterns
│
├── sites.anon/     → Anonymous/public pages
├── sites.app/      → Authenticated app shell
├── sites.app.parts/→ Platform features (settings, messages, etc.)
├── sites.app.lets/ → Domain modules (business features)
└── sites.app.dev/  → Developer tools
```

## Purpose

The `sites/` tier provides shared infrastructure for all site implementations:

1. **Module Re-exports**: Single import point for common dependencies
2. **Site-level Widgets**: Reusable page-level components
3. **Shared Patterns**: Common UI patterns used across all sites

## What Belongs Here

✅ **DO put here:**
- Page-level layout components (PageHeader, PageShell)
- Common state components (EmptyState, LoadingState, ErrorState)
- Site-wide UI patterns that work for both anonymous and authenticated pages
- Shared site-level services (if any)

❌ **DON'T put here:**
- Theme-specific styling (belongs in `themes/`)
- Angular infrastructure (belongs in `core.ag/`)
- Business logic (belongs in `sites.app.parts/` or `sites.app.lets/`)
- Authentication-specific components (belongs in specific site tier)

## Usage

### In NgModule-based tiers:

```typescript
import { SitesModule } from '../sites';

@NgModule({
  imports: [SitesModule],
  // ...
})
export class MyFeatureModule { }
```

### In Standalone Components:

```typescript
// Import specific components directly
import { PageHeaderComponent } from '../sites/ui/widgets/page-header';

@Component({
  standalone: true,
  imports: [PageHeaderComponent],
  // ...
})
export class MyPageComponent { }
```

## Module Structure

```
sites/
├── ui/
│   └── widgets/
│       ├── page-header/       # (planned) Back + Icon + Title + Actions
│       ├── empty-state/       # (planned) "No items" patterns
│       ├── loading-state/     # (planned) Spinners, skeletons
│       └── error-state/       # (planned) Error display patterns
├── module.ts                  # SitesModule with re-exports
├── index.ts                   # Barrel exports
└── README.md                  # This file
```

## Lazy Loading

This tier is designed for lazy-loading compatibility:

- Child tiers import `SitesModule` which brings the full dependency chain
- Standalone components can be imported individually for tree-shaking
- No eager imports that would defeat code splitting

## Child Tiers

| Tier | Purpose | Auth Required |
|------|---------|---------------|
| `sites.anon/` | Public/marketing pages | No |
| `sites.app/` | Authenticated app shell | Yes |
| `sites.app.parts/` | Platform features | Yes |
| `sites.app.lets/` | Domain mini-apps | Yes |
| `sites.app.dev/` | Developer tools | Yes |

---

Created: 2025-12-27  
Updated: 2026-01-18 - Added SitesModule with re-exports
