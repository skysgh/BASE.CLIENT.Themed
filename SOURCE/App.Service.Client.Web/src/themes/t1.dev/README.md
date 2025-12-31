# themes/t1.dev - Theme T1 Developer Reference

**Status:** Active  
**Purpose:** Developer reference for Velzon theme (T1) components

---

## 🎯 Purpose

This module extends `themes/t1` with developer reference pages. It provides **direct access to Velzon theme components** for exploration and reference.

**Why here and not in `sites.app.dev`?**
- These pages directly extend `themes/t1` (Velzon theme)
- They use theme-specific components and styles
- Co-location with the theme they document

---

## 📁 Structure

```
themes/t1.dev/
├── module.ts                 ← Main lazy-loaded module
├── routing.ts                ← Routes (nested: /minimal/icons, etc.)
├── views/
│   └── dev-hub/              ← Hub page with links
├── reference/                ← Near-direct copies of Velzon pages
│   ├── icons/                ← Icon libraries (Remix, BoxIcons, etc.)
│   ├── ui/                   ← UI components (buttons, cards, etc.)
│   ├── charts/               ← Charts (ApexCharts, Chart.js, ECharts)
│   ├── forms/                ← Form elements and layouts
│   ├── tables/               ← Data tables (Grid.js, List.js)
│   └── maps/                 ← Map integrations (Leaflet, Google)
├── data/                     ← Static data for reference pages
├── services/                 ← Helper services
└── components/               ← Shared components (breadcrumbs shim)
```

---

## 🛤️ Routes

All routes are under `/apps/dev/theme/t1`:

| Route | Description |
|-------|-------------|
| `/apps/dev/theme/t1` | T1 Theme Hub |
| `/apps/dev/theme/t1/minimal/icons/*` | Icon libraries |
| `/apps/dev/theme/t1/minimal/ui/*` | UI components |
| `/apps/dev/theme/t1/minimal/charts/*` | Chart examples |
| `/apps/dev/theme/t1/minimal/forms/*` | Form elements |
| `/apps/dev/theme/t1/minimal/tables/*` | Table examples |
| `/apps/dev/theme/t1/minimal/maps/*` | Map integrations |

**Why "minimal"?**
Velzon theme has multiple variants:
- **Minimal** (currently implemented)
- Default
- Material
- Creative

This nesting allows future expansion to other variants.

---

## 🔧 Future Extensions

The `/apps/dev/` path can host other developer tools:

```
/apps/dev/
├── theme/
│   ├── t1/                   ← Velzon theme (this module)
│   │   ├── minimal/          ← Minimal variant (current)
│   │   ├── default/          ← Default variant (future)
│   │   └── material/         ← Material variant (future)
│   └── t2/                   ← Another theme (future)
├── integrations/
│   ├── stripe/               ← Stripe payment examples
│   ├── oauth/                ← OAuth integration examples
│   └── oidc/                 ← OIDC/IdP examples
└── tools/
    ├── icons/                ← Icon picker
    └── colors/               ← Color palette
```

---

## ⚠️ Important Notes

### **Not for Production**

This module should be **excluded from production builds** or hidden behind a feature flag.

### **Lazy Loading**

All reference modules are lazy-loaded:
```typescript
{ path: 'icons', loadChildren: () => import('./reference/icons/module').then(m => m.IconsReferenceModule) }
```

### **Source**

Pages copied from Velzon:
```
Z:\S\Unsynced\REPOS\Velzon_Angular\Angular\minimal\src\app\pages\
```

---

**Created:** 2025-12-31  
**Theme:** Velzon (Minimal, Vertical)
