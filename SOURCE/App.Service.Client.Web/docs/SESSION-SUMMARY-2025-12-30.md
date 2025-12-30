# BASE.Client.Themed - Architecture & Progress Summary

**Date:** 2025-12-30  
**Session Duration:** Full day  
**Repository:** https://github.com/skysgh/BASE.CLIENT.Themed

---

## 🎯 Project Vision

A **multi-tenant, themeable Angular 18 SaaS platform** with:
- Account-aware configuration (branding, features, data per tenant)
- Modular applet architecture
- Strict separation of concerns (tech vs business domains)
- Future-proof nestable structure

---

## 🏗️ Architecture Overview

### Layer Hierarchy

```
┌─────────────────────────────────────────────┐
│  sites.anon (Public/Landing)                │
│  sites.app (Authenticated App)              │
├─────────────────────────────────────────────┤
│  sites.app.lets/* (Feature Applets)         │
├─────────────────────────────────────────────┤
│  themes/t1 (Velzon Theme Layer)             │
├─────────────────────────────────────────────┤
│  apps.bootstrap (App Initialization)        │
├─────────────────────────────────────────────┤
│  core.ag (Angular-specific utilities)       │
├─────────────────────────────────────────────┤
│  core (Framework-agnostic core)             │
└─────────────────────────────────────────────┘
```

### Applet Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| `service.*` | Platform infrastructure (tech + business) | `service.about`, `service.billing`, `service.compliance` |
| `app.*` | Business domain features | `app.people`, `app.catalog`, `app.orders` |
| `spike` | Development/testing sandbox | Forms, patterns, experiments |

---

## ✅ Completed Work

### 1. Core Infrastructure
- [x] Multi-account configuration system (`AccountService`)
- [x] Translation pipeline (`baseTranslate` pipe)
- [x] Reactive navigation (`NavigationDataService`)
- [x] Asset path resolution (static vs dynamic, open vs sensitive)

### 2. Error Handling
- [x] Parameterized error pages (`/errors/:layout/:code`)
- [x] Centralized error configuration (`error-data.ts`)
- [x] Three layouts: basic, cover, alt
- [x] Fixed image paths (trailing slashes)
- [x] Fixed translation keys

### 3. Service Applets
- [x] `service.about` - Version, licenses, creator/distributor/account info
- [x] `service.compliance` - Terms, privacy, corrections
- [x] `service.payment-processing` (→ rename to `service.billing`)
  - Payment methods CRUD
  - Subscription flow (plan → payment → confirm → success)
  - Transaction history
  - Mock data ready for gateway integration

### 4. Development Tooling
- [x] TypeScript strict mode enabled
- [x] ES2022 target (warning eliminated)
- [x] Applet path builder for nestability

---

## 🔧 Fixes Applied Today

| Issue | Fix |
|-------|-----|
| ES2022 warning on startup | Updated `tsconfig.json` target to ES2022 |
| Favicon 404 | Fixed path in `index.html` |
| france.svg 404 | Created copy from `fr.svg` |
| Error page image broken | Added trailing slash to page paths |
| Translation keys not resolving | Fixed key format in error-data.ts |
| TrustedBy images 404 | Created placeholder images in default account folder |
| Arrow function in template | Moved `.find()` to component method |

---

## 📋 Pending Decisions

### 1. Applet Naming
| Current | Proposed | Status |
|---------|----------|--------|
| `service.payment-processing` | `service.billing` | **Needs rename** |
| (new) | `service.payment-gateway` | Tech-only (Stripe/PayPal APIs) |
| (new) | `app.catalog` | Product/plan display |
| (new) | `app.checkout` | Cart → order flow |
| (new) | `app.orders` | Order history (BREAD) |

### 2. Domain Layering (Bottom → Top)
1. **System** - Infrastructure, APIs, Config
2. **Identity** - Users, Auth, Sessions
3. **Social** - People, Relationships, Groups, Roles
4. **Commerce** - Products, Pricing, Catalog
5. **Transactions** - Cart, Checkout, Orders
6. **Billing** - Payments, Subscriptions, Invoices
7. **Scheduling** - Calendar, Appointments
8. **Work** - Projects, Tasks, Workflows

### 3. UX Principles (Your Rules)
- Views are **Input OR Output OR Collection** (never hybrid)
- **No modals** (state transfers via navigation)
- **BREAD** layout: Browse → Read → Edit → Add → Delete(soft)
- **Context / Resource / Status** layout pattern
- Header = service/account/user context
- Main = resource content
- Footer = async status/health

---

## 🗂️ Key Files Reference

### Configuration
- `tsconfig.json` - TypeScript settings (strict mode enabled)
- `angular.json` - Build configuration
- `src/assets/config/default.json` - Account default config

### Applet Structure (Template)
```
sites.app.lets/{applet-name}/
├── constants/          ← Name, paths, routes
├── models/             ← DTOs, interfaces
├── services/           ← Business logic (signals-based)
├── repositories/       ← API calls (if needed)
├── views/              ← View components
│   ├── {view-name}/
│   │   ├── component.ts
│   │   ├── component.html
│   │   ├── component.scss
│   │   └── vm.ts       ← ViewModel (if complex)
├── forms/              ← Form definitions (Formly)
├── widgets/            ← Dashboard widgets
├── module.ts
└── routing.ts
```

### Path Building (New Pattern)
```typescript
// src/core/applets/applet-path.builder.ts
import { buildAppletPaths } from '../../../core/applets/applet-path.builder';

// Flat applet
export const PATHS = buildAppletPaths('spike');

// Nested applet (future)
export const PATHS = buildAppletPaths('billing', 'service');
```

---

## 🚀 Next Steps (Priority Order)

### Immediate
1. [ ] Rename `service.payment-processing` → `service.billing`
2. [ ] Fix navigation links (currently 404)
3. [ ] Add menu entries for billing applet

### Short-term
1. [ ] Create `app.people` applet (Social foundation)
2. [ ] Create `service.payment-gateway` (Stripe/PayPal integration stub)
3. [ ] Apply `buildAppletPaths()` to existing applets

### Medium-term
1. [ ] Create `app.catalog` (product/plan display)
2. [ ] Create `app.checkout` (cart → order flow)
3. [ ] Wire checkout to billing

### Hardening
1. [ ] Add `noUncheckedIndexedAccess` to tsconfig (incremental)
2. [ ] Document architecture in `/docs/ARCHITECTURE.md`
3. [ ] Add unit tests for services

---

## 💡 Open Questions for Next Session

1. **Applet grouping**: Should we physically nest applets now (`service/billing/`) or keep flat with prefixes (`service.billing/`)?

2. **Navigation**: Where should billing appear in sidebar?
   - Under Settings?
   - As standalone "Billing" menu?
   - Under "Account" section?

3. **People applet**: Start with `app.people` or `app.social` as parent?

4. **Form system**: Continue with Formly or switch to reactive forms?

---

## 📊 Session Statistics

- **Files Created:** ~30+
- **Files Modified:** ~20+
- **Applets Scaffolded:** 1 (service.payment-processing)
- **Bugs Fixed:** 7+
- **Patterns Established:** 3 (path builder, error handling, view structure)

---

## 🔗 Quick Start for Next Session

```
Share this file: docs/SESSION-SUMMARY-2025-12-30.md

Key context:
- Angular 18 multi-tenant SaaS
- Velzon theme (themes/t1)
- Signals-based services
- TypeScript strict mode
- Applet architecture in sites.app.lets/
```

---

*Generated by GitHub Copilot - Session Summary*
