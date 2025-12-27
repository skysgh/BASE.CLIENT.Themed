# Cross-Tier Coupling Elimination - Systematic Refactoring Plan

## Date: 2024-12-16
## Status: 🔄 IN PROGRESS

---

## 🎯 **Objective**

Eliminate ALL `appsConfiguration` cross-tier imports and replace with proper architecture:
- Use `tierConfiguration` for tier-specific config
- Use DI tokens (DEPLOYED_RESOURCES) for shared resources
- Follow loose coupling principles

---

## 📊 **Scope: 42 Files to Refactor**

### ✅ **Phase 0: Foundation (COMPLETED)**
- [x] Created `DEPLOYED_RESOURCES` token in `core/tokens/resource.tokens.ts`
- [x] Fixed `createTranslateLoader` to use convention-based paths
- [x] Fixed sidebar component as template example
- [x] Documented pattern in `ARCHITECTURE-FIX-COMPLETED.md`

### 🔄 **Phase 1: sites.anon Tier (12 files) - CURRENT**

**Landing Page Components:**
- [ ] `features/pages/landing/index/component.html` + `.ts`
- [ ] `features/pages/landing/maintenance/component.html` + `.ts`
- [ ] `features/pages/landing/_sharedparts/components/intro/component.html` + `.ts`
- [ ] `features/pages/landing/_sharedparts/components/clients/component.html` + `.ts`
- [ ] `features/pages/landing/_sharedparts/components/contact/component.html` + `.ts`
- [ ] `features/pages/landing/_sharedparts/components/designed/component.html` + `.ts`
- [ ] `features/pages/landing/_sharedparts/components/team/component.html` + `.ts`

**Information Page Components:**
- [ ] `features/pages/information/components/index/component.html` + `.ts`
- [ ] `features/pages/information/components/index/components/header/component.html` + `.ts`
- [ ] `features/pages/information/components/index/components/footer/component.html` + `.ts`
- [ ] `features/pages/information/components/privacy/component.ts`
- [ ] `features/pages/information/components/terms/component.ts`

**Estimated Time:** 2-3 hours

---

### ⏳ **Phase 2: themes/t1 Layout Components (20 files) - NEXT**

**Footers:**
- [ ] `components/footers/footerA/component.html` + `.ts`
- [ ] `components/footers/footerB/component.html` + `.ts`
- [ ] `components/footers/footerO/component.html` + `.ts`

**Layout Components:**
- [ ] `components.layout/horizontal-topbar/component.html` + `.ts`
- [ ] `components.layout/topbar/logo/component.html` + `.ts`
- [ ] `components.layout/topbar/notifications/x.component.html` + `.ts`
- [ ] `components.layout/topbar/search/component.html` + `.ts`
- [ ] `components.layout/topbar/shopping/component.html` + `.ts`
- [ ] `components.layout/topbar/user/component.html` + `.ts`
- [ ] `components.layout/two-column-sidebar/two-column-sidebar.component.html` + `.ts`
- [ ] `components.layout/components/language/component.ts`

**Estimated Time:** 2 hours

---

### ⏳ **Phase 3: themes/t1 Auth Components (10 files) - LATER**

**Error Pages:**
- [ ] `features/errors/404/basic/component.html` + `.ts`
- [ ] `features/errors/404/cover/component.html` + `.ts`
- [ ] `features/errors/500/component.html` + `.ts`

**Auth Pages:**
- [ ] `features/user/account/auth/lockscreen/basic/component.html` + `.ts`
- [ ] `features/user/account/auth/lockscreen/cover/component.html` + `.ts`
- [ ] `features/user/account/auth/logout/basic/component.html` + `.ts`
- [ ] `features/user/account/auth/logout/cover/component.html` + `.ts`
- [ ] `features/user/account/auth/pass-create/basic/component.html` + `.ts`
- [ ] `features/user/account/auth/pass-create/cover/component.html` + `.ts`
- [ ] `features/user/account/auth/pass-reset/basic/component.html` + `.ts`
- [ ] `features/user/account/auth/pass-reset/cover/component.html` + `.ts`
- [ ] `features/user/account/auth/signin/cover/component.html` + `.ts`
- [ ] `features/user/account/auth/signup/basic/component.html` + `.ts`
- [ ] `features/user/account/auth/signup/cover/component.html` + `.ts`
- [ ] `features/user/account/auth/twostep/basic/component.html` + `.ts`
- [ ] `features/user/account/auth/twostep/cover/component.html` + `.ts`
- [ ] `features/user/account/register/component.html` + `.ts`

**Estimated Time:** 1.5 hours

---

## 🔧 **Refactoring Pattern**

### **For TypeScript Files (.ts):**

**Before:**
```typescript
import { appsConfiguration } from '../../../../../sites.app/configuration/...';

export class MyComponent {
  public appsConfiguration = appsConfiguration;
}
```

**After:**
```typescript
import { Inject } from '@angular/core';
import { DEPLOYED_RESOURCES, DeployedResources } from '../../../../../core/tokens';
import { sitesAnonConfiguration } from '../../../configuration/implementations/sites.anon.configuration';

export class MyComponent {
  public resources: DeployedResources;
  public tierConfiguration = sitesAnonConfiguration;
  
  constructor(@Inject(DEPLOYED_RESOURCES) resources: DeployedResources) {
    this.resources = resources;
  }
}
```

### **For HTML Templates (.html):**

**Before:**
```html
<img src="{{this.appsConfiguration.others.sites.constants.assets.images.logos}}logo.png">
<p>{{this.appsConfiguration.description.description}}</p>
```

**After:**
```html
<img [src]="resources.logos.dark">
<p>{{tierConfiguration.description.description}}</p>
```

---

## 📋 **Verification Checklist (Per Component)**

- [ ] No `import { appsConfiguration }` statement
- [ ] No `public appsConfiguration` property
- [ ] Has `public tierConfiguration = {tier}Configuration`
- [ ] Has `public resources: DeployedResources`
- [ ] Constructor injects `@Inject(DEPLOYED_RESOURCES)`
- [ ] Template uses `resources.logos.*` for images
- [ ] Template uses `tierConfiguration.*` for tier-specific config
- [ ] Component compiles without errors
- [ ] Component renders correctly in browser

---

## 🎯 **Success Criteria (Overall)**

- [ ] Zero `appsConfiguration` cross-tier imports in active code
- [ ] All components use proper tier configuration
- [ ] All images load correctly (no 404s)
- [ ] All translations display correctly (no keys showing)
- [ ] App builds successfully
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Architecture debt eliminated

---

## 📝 **Progress Tracking**

| Phase | Files | Status | Time Spent | Completed |
|-------|-------|--------|-----------|-----------|
| Phase 0 | 4 | ✅ DONE | 2h | 2024-12-16 |
| Phase 1 | 12 | 🔄 IN PROGRESS | 0h | - |
| Phase 2 | 20 | ⏳ PENDING | 0h | - |
| Phase 3 | 10 | ⏳ PENDING | 0h | - |
| **TOTAL** | **46** | **9% Complete** | **2h** | **ETA: 6-7h** |

---

## 🚀 **Next Steps**

1. **Start Phase 1:** Fix sites.anon landing page intro component (most visible)
2. Fix remaining sites.anon components
3. Test sites.anon pages (landing, information)
4. Commit Phase 1
5. Move to Phase 2

---

## 📚 **Reference Documents**

- `core/tokens/resource.tokens.ts` - Token definition
- `ARCHITECTURE-FIX-COMPLETED.md` - Pattern documentation
- `themes/t1/components.layout/sidebar/sidebar.component.ts` - Example implementation

---

**Status:** Ready to begin Phase 1 - sites.anon tier refactoring
**Current Focus:** Landing page intro component (most visible on homepage)
