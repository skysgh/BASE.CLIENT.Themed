# Service Theme App.let

## Overview

Theme reference and documentation for applet developers.

## Purpose

This app.let provides:
- **Color Palette** - Theme colors with CSS variable names
- **Icons Reference** - BoxIcons search and usage
- **Typography** - Font styles and utilities
- **Components** - Buttons, badges, cards, alerts
- **Forms** - Form field styles and FormRenderer usage

## Why This Exists

3rd party applet developers need to know what's available in the theme
without digging through the actual theme package (`themes/t1/`).

This provides a **living style guide** accessible at `/apps/theme/`.

## Routes

| Route | Description |
|-------|-------------|
| `/apps/theme/` | Theme hub |
| `/apps/theme/colors` | Color palette |
| `/apps/theme/icons` | Icon reference |
| `/apps/theme/typography` | Font styles |
| `/apps/theme/components` | UI components |
| `/apps/theme/forms` | Form patterns |

## Adding to Navigation

To enable this app.let, add to your navigation config:

```typescript
{
  label: 'Theme Reference',
  icon: 'bx-palette',
  link: '/apps/theme',
}
```

## For Applet Developers

When building your applet:
1. Browse this reference to see available styles
2. Use CSS variables (`var(--vz-primary)`) for consistency
3. Use Bootstrap utilities (`.text-muted`, `.mb-3`, etc.)
4. Use `<app-form-renderer>` instead of raw Formly
5. Use `<app-browse-page>` and `<app-read-page>` for chrome
