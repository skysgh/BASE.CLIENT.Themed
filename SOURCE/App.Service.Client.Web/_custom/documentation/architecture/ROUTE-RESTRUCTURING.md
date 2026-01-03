# Route Architecture Restructuring

## Problem Statement

Currently all authenticated routes are under `/apps/`:
- `/apps/spike/` - Domain applet ✅ correct
- `/apps/system/hub` - User landing ❌ wrong parent
- `/apps/system/settings` - Settings ❌ wrong parent
- `/apps/system/trash` - Recycle bin ❌ wrong parent

This creates confusion because `/apps/system/` mixes:
1. **Operational** concerns (settings, access control)
2. **User-facing** system features (hub, trash, messages)

## Target Structure

```
/apps/{applet}/          → Domain applets ONLY (sites.app.lets/)
  /apps/spike/           - Discovery/development
  /apps/catalog/         - Product catalog (future)
  /apps/orders/          - Order management (future)

/system/{part}/          → Platform parts (sites.app.parts/)
  /system/hub/           - Central landing page
  /system/messages/      - Internal messaging
  /system/trash/         - Recycle bin
  /system/support/       - Help/support tickets
  /system/about/         - App information
  /system/wiki/          - Documentation wiki
  /system/billing/       - User billing/subscriptions
  /system/notifications/ - Notification center
  /system/settings/      - User & account settings (not system-admin)
  /system/authentication/- Profile management

/admin/{module}/         → Administrative (role-gated, future)
  /admin/operate/        - Operations dashboard
  /admin/accounts/       - Account management
  /admin/access/         - Access control
  /admin/diagnostics/    - System logs
  /admin/i18n/           - Language management

/errors/{code}           → Error pages (always accessible)
  /errors/404
  /errors/500
  /errors/403
```

## Implementation Changes

### 1. core.ag/_app_extension/routing.ts
Add new top-level routes:
- `{ path: 'system', ... }` → loads sites.app.parts routing
- Keep `{ path: 'apps', ... }` → loads sites.app.lets ONLY

### 2. sites.app/routing.ts
Keep ONLY domain applets:
- `{ path: 'spike', ... }`
- Remove all `system/*` routes

### 3. Create sites.app.parts/routing.ts
New routing module for platform parts:
- `{ path: 'hub', ... }`
- `{ path: 'messages', ... }`
- `{ path: 'trash', ... }`
- etc.

### 4. Update NavigationService
Add 'system' to reserved routes list

### 5. Update all route references
- Topbar user component
- Navigation data service
- Any hardcoded links in components

## Account Prefix Behavior

Both `/apps/` and `/system/` support account prefixes:
- `/apps/spike/` (default account)
- `/foo/apps/spike/` (account "foo")
- `/system/hub/` (default account)
- `/foo/system/hub/` (account "foo")

## Migration Notes

- This is a breaking change for any saved bookmarks
- Consider adding redirects: `/apps/system/*` → `/system/*`
