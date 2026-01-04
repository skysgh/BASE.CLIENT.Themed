# Component Folder Refactoring Audit

## Standard UI Folder Pattern

All UI components should follow this structure:
```
{module}/ui/
  views/          - Full-page routed components
  viewsections/   - Reusable view sections (renamed from views-parts)
  widgets/        - Small reusable UI components
```

**NOT** `{module}/components/` - this is the legacy pattern to eliminate.

## Completed Refactoring ✅

| Date | Location | Action |
|------|----------|--------|
| 2026-01-03 | `sites.app.parts/compliance-cookie-consent/ui/components/` | Removed (was empty) |
| 2026-01-03 | `sites.app.parts/compliance/ui/components/` | Removed (was empty) |
| 2026-01-03 | `core/auth/components/` | Removed (deprecated, moved to core.ag/auth/ui/widgets) |
| 2026-01-03 | `core/components/` | Moved to `core.ag/ui/widgets/` (child-summary, drill-selector, faq-viewer) |
| 2026-01-03 | `views-parts` folders | Renamed to `viewsections` |
| 2026-01-04 | `sites.anon/features/dashboard/components/` | Moved to `ui/views/` ✅ Imports fixed |
| 2026-01-04 | `sites.anon/features/pages/components/` | Moved to `ui/views/` ✅ Imports fixed |
| 2026-01-04 | `sites.anon/features/pages/information/components/` | Moved to `ui/views/` ✅ Imports fixed |
| 2026-01-04 | `sites.anon/features/pages/landing/home/components/` | Moved to `ui/views/home-index/` ✅ Imports fixed |
| 2026-01-04 | `sites.anon/features/pages/landing/_sharedparts/components/` | Moved to `ui/viewsections/` ✅ All 16 components fixed |
| 2026-01-04 | `sites.anon/features/pages/parts/plans/components/` | Moved to `ui/widgets/` |
| 2026-01-04 | `sites.anon/features/pages/descriptionAdmin/components/` | Moved to `ui/views/` |

## Import Fixes Applied ✅

### Module files
- `sites.anon/features/pages/landing/home/module.ts` ✅
- `sites.anon/features/pages/landing/home/routes.ts` ✅
- `sites.anon/features/pages/landing/_sharedparts/module.ts` ✅
- `sites.anon/features/dashboard/module.ts` ✅
- `sites.anon/features/pages/module.ts` ✅
- `sites.anon/features/pages/information/module.ts` ✅

### Viewsections components (all 16)
- `body/component.ts` ✅
- `capabilities/component.ts` ✅
- `clients/component.ts` ✅
- `contact/component.ts` ✅
- `cta/component.ts` ✅
- `designed/component.ts` ✅
- `endorsements/component.ts` ✅
- `faqs/component.ts` ✅
- `features/component.ts` ✅
- `header/component.ts` ✅
- `intro/component.ts` ✅
- `plan/component.ts` ✅
- `process/component.ts` ✅
- `scrollBackToTop/component.ts` ✅
- `stats/component.ts` ✅
- `team/component.ts` ✅

### Information views (all 6)
- `index/component.ts` ✅
- `contact/component.ts` ✅
- `corrections/component.ts` ✅
- `privacy/component.ts` ✅
- `support/component.ts` ✅
- `terms/component.ts` ✅

### Dashboard views
- `dashboard-index/component.ts` ✅

### Pages views
- `_routeoutlet/component.ts` ✅

### Home views
- `home-index/component.ts` ✅

### Other fixes
- `sites.app.lets/spike/module.ts` ✅ CoreComponentsModule → BaseCoreAgComponentsModule
- `sites.app.parts/billing/module.ts` ✅ CoreComponentsModule → BaseCoreAgComponentsModule
- `sites.app.parts/help/ui/views/faq-page/component.ts` ✅ core/components → core.ag/ui/widgets
- `spike/modules/spike/ui/views/read/component.ts` ✅ SummaryItem import path

## Build Status
✅ **BUILD SUCCESSFUL** - All import paths fixed

## Pattern Applied

When moving files from `components/X/` to `ui/viewsections/X/` (2 levels deeper):
- Add 1 extra `../` to all relative imports pointing to configuration, services, core
- Imports to sibling files (vm.ts, sectionsInfo.data.ts) may need adjustment based on where they were placed

Example path adjustments:
- `../../foo` → `../../../foo` (if foo stayed at original level)
- `../../../core/...` → `../../../../core/...`
