# Sites Parent Tier

**Purpose**: Shared components and utilities for all sites tiers

**Description**:
This parent tier contains components, utilities, and types that are shared between:
- `sites.anon/` (public marketing)
- `sites.app/` (authenticated app)
- `sites.app.lets/` (mini-apps)

**What Goes Here**:
- **Shared Components**: Footer, header, error pages
- **Shared Utilities**: URL helpers, validators (sites-specific, not generic)
- **Shared Types**: Interfaces/types used across sites tiers
- **Common Layouts**: Base page structures

**What Doesn't Go Here**:
- Generic utilities → Go in `core/` or `core.ag/`
- Theme-specific components → Go in `themes/`
- Tier-specific features → Go in respective child tier

---

## Structure

```
sites/
  components.common/     ← Shared components
    footer/
    header/
    error-pages/
  utilities/             ← Sites-specific utilities
  types/                 ← Shared type definitions
  
  sites.anon/            ← Child: Public tier
  sites.app/             ← Child: Authenticated tier
    sites.app.lets/      ← Grandchild: Mini-apps
```

---

## Child Tiers

| Tier | Purpose | Auth Required | URL Pattern |
|------|---------|---------------|-------------|
| `sites.anon/` | Public marketing | No | `/`, `/pricing`, `/about` |
| `sites.app/` | Authenticated app | Yes | `/app/*` |
| `sites.app.lets/` | Mini-apps | Yes | `/app/education/*`, etc. |

---

## Status

🚧 **Under Construction** - Tier restructuring in progress

Next steps:
1. Create components.common/ directory
2. Identify shared components from sites.anon and sites.app
3. Move shared components here
4. Update imports in child tiers

---

Created: 2025-12-26  
Part of: Sites Tier Restructuring
