# Sites.App Tier

**Purpose**: Authenticated application tier

**Description**:
This tier contains the main authenticated application features that require user login.

**Contents**:
- Dashboard features
- Reports
- Settings
- User-specific functionality

**Relationship**:
- **Parent**: `sites/` (shared components)
- **Sibling**: `sites.anon/` (public marketing)
- **Child**: `sites.app.lets/` (mini-apps)

**URL Pattern**: `/app/*`

**Auth Required**: Yes (entire tier protected by AuthGuard)

---

## Structure

```
sites.app/
  constants/          ← To be created
  configuration/      ← To be created
  features/           ← To be moved from sites.anon/features/dashboard, etc.
    dashboard/
    reports/
    settings/
  module.ts           ← To be created
  routing.module.ts   ← To be created
```

---

## Status

🚧 **Under Construction** - Tier restructuring in progress

Next steps:
1. Create configuration files
2. Move authenticated features from sites.anon
3. Update routing
4. Update imports

---

Created: 2025-12-26  
Part of: Sites Tier Restructuring (sites.anon + sites.app + sites.app.lets)
