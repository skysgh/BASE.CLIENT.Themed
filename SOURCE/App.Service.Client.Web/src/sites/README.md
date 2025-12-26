# Sites Parent Tier

**Purpose**: Shared components and utilities for all sites tiers

**Description**:
This parent tier contains components, utilities, and types that are shared between:
- `sites.anon/` (public marketing)
- `sites.app/` (authenticated app)
- `sites.app.lets/` (mini-apps)

**What Goes Here**:
- **Shared Components**: Footer, header, error pages
- **Shared Utilities**: URL helpers, validators (sites-specific)
- **Shared Types**: Interfaces/types used across sites tiers

---

## Child Tiers

| Tier | Purpose | Auth Required |
|------|---------|---------------|
| `sites.anon/` | Public marketing | No |
| `sites.app/` | Authenticated app | Yes |
| `sites.app.lets/` | Mini-apps | Yes |

---

Created: 2025-12-27  
Part of: Sites Tier Restructuring
