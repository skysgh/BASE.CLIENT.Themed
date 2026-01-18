# Theme Reference Module

## Overview

**Developer-only** style guide and component reference for applet developers.

> **Note**: User appearance settings have moved to the **Settings module** at
> `/system/settings/{level}/appearance`. This module is for developer documentation only.

## Purpose

This module provides:
- **Color Palette** - Theme colors with CSS variable names
- **Icons Reference** - BoxIcons search and usage  
- **Typography** - Font styles and utilities
- **Components** - Buttons, badges, cards, alerts
- **Forms** - Form field styles and FormRenderer usage

## Why This Exists

3rd party applet developers need to know what's available in the theme
without digging through the actual theme package (`themes/t1/`).

This provides a **living style guide** accessible at `/system/theme/`.

## Routes

| Route | Description |
|-------|-------------|
| `/system/theme/` | Theme reference hub |
| `/system/theme/colors` | Color palette |
| `/system/theme/icons` | Icon reference |
| `/system/theme/typography` | Font styles |
| `/system/theme/components` | UI components |
| `/system/theme/forms` | Form patterns |

## User Appearance Settings

End-user appearance preferences (dark mode, layout, sidebar colors) are configured at:

| Route | Description |
|-------|-------------|
| `/system/settings/user/appearance` | User-level preferences |
| `/system/settings/account/appearance` | Account-level defaults (admin) |
| `/system/settings/service/appearance` | Service-level defaults (super admin) |

See `sites.app.parts/settings/` for the settings implementation.

## Enabling This Module

This module is typically **disabled** in production (`service.theme.enabled: false` in account config).

To enable for development:

```json
// In accounts/default.json
{
  "applets": {
    "service.theme": {
      "enabled": true,
      "showInNav": true
    }
  }
}
```

## For Applet Developers

When building your applet:
1. Browse this reference to see available styles
2. Use CSS variables (`var(--vz-primary)`) for consistency
3. Use Bootstrap utilities (`.text-muted`, `.mb-3`, etc.)
4. Use `<app-form-renderer>` instead of raw Formly
5. Use `<app-browse-page>` and `<app-read-page>` for chrome
