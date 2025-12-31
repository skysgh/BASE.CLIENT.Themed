# sites.app.parts - Platform Applets

This folder contains **platform applets** - system-level features that support users
but aren't the primary reason they came to the application.

## URL Pattern
All applets in this folder are served under `/system/*`:
- `/system/billing` - Subscription and payment management
- `/system/settings` - Configuration hub
- `/system/about` - Service information, versions, licenses
- `/system/compliance` - Legal documents (terms, privacy)
- `/system/search` - Universal search
- `/system/operate` - Admin operations
- `/system/theme` - Developer theme reference

## vs sites.app.lets
| Folder | URL Prefix | Purpose |
|--------|------------|---------|
| `sites.app.lets` | `/app/` | User domains - what they came for |
| `sites.app.parts` | `/system/` | Platform support - what helps them use it |

## Applet Structure
Each applet follows the standard structure:
```
{applet-name}/
├── constants/          ← Name, paths, routes
├── models/             ← DTOs, interfaces
├── services/           ← Business logic (signals-based)
├── repositories/       ← API calls (if needed)
├── views/              ← View components
├── forms/              ← Form definitions (if needed)
├── widgets/            ← Dashboard widgets (if needed)
├── module.ts
└── routing.ts
```

## Using the Path Builder
```typescript
import { buildAppletPaths, APPLET_CONTAINERS } from '../../core/applets/applet-path.builder';

export const BILLING_PATHS = buildAppletPaths('billing', { 
  container: APPLET_CONTAINERS.parts 
});
// Result: fullRoute = '/system/billing'
```
