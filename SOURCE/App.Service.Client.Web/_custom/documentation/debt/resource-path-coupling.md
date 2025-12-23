# Architectural Debt: Resource Path Coupling

**Status**: 🔴 **ACTIVE ISSUE** - Causing 404s + architectural violation  
**Created**: 2025-01-XX  
**Severity**: High (functional + architectural)  
**Area**: Tier Architecture, Dependency Management

---

## Problem Summary

Sites tier components directly reference Apps/Apps.Main tier resources (logos, images), violating tier dependency direction.

```
❌ WRONG: Sites → Apps.Main (upward coupling)
✅ RIGHT: Sites ← Apps.Main (downward via DI)
```

---

## Affected Components

### 1. Header Component
**File**: `src/sites/features/pages/landing/_sharedparts/components/header/component.ts`

**Current Code**:
```typescript
import { appsMainConstants } from '../../../../../../../apps.main/constants/implementations/apps.main.constants';

export class BaseAppsPagesLandingIndexHeaderComponent {
  public appsMainConstants = appsMainConstants; // ❌ Direct upward coupling
}
```

```html
<img src="{{this.appsMainConstants.resources.open.images.logos}}logo-dark.png">
<img src="{{this.appsMainConstants.resources.open.images.logos}}logo-light.png">
```

**Issue**: Direct import from Apps.Main tier creates tight coupling

---

### 2. Footer Component
**File**: `src/sites/features/pages/information/components/index/components/footer/component.ts`

**Current Code**:
```typescript
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';

export class BaseAppsPagesLandingIndexFooterComponent {
  public appsConfiguration = appsConfiguration; // ⚠️ Indirect upward coupling
}
```

```html
<img src="{{this.appsConfiguration.constants.resources.open.images.logos}}logo-light.png">
```

**Issue**: Indirect coupling via Apps tier (slightly less bad but still wrong)

---

## Why This Is Bad

### 1. **Violates Tier Architecture**
```
Core     (lowest - shared utilities)
  ↓
Apps     (middleware - app config)
  ↓
Apps.Main (root application)
  ↓
Sites    (feature modules) ← SHOULD NOT reference Apps.Main!
```

**Dependency Rule**: Lower tiers don't know about higher tiers

### 2. **Blocks Library Extraction**
- Can't extract Sites to library while it imports Apps.Main
- Can't extract Core/CoreAg while config is hardcoded
- See: `library-extraction-roadmap.md`

### 3. **Makes Testing Hard**
- Must mock entire Apps.Main to test Sites components
- Tight coupling prevents isolated unit tests

### 4. **Reduces Reusability**
- Sites components can't be reused in different apps
- Hardcoded to specific Apps.Main structure

---

## Comparison of Approaches

| Approach | Coupling Type | Testability | Reusability | Architecture |
|----------|--------------|-------------|-------------|--------------|
| **appsConfiguration** (Footer) | ⚠️ Indirect upward | ⚠️ Hard | ❌ Low | ⚠️ Wrong direction |
| **appsMainConstants** (Header) | ❌ Direct upward | ❌ Very hard | ❌ None | ❌ Violates tiers |
| **Injection Token** (Proposed) | ✅ Decoupled | ✅ Easy | ✅ High | ✅ Correct flow |
| **Service Abstraction** (Ideal) | ✅ Decoupled | ✅ Easy | ✅ High | ✅ Correct + flexible |

---

## Proposed Solution

### Option A: Injection Token (Quick - 2 hours)

**Step 1: Create Token**
```typescript
// core/tokens/resource.tokens.ts
export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');

export interface ResourcePaths {
  logos: {
    light: string;
    dark: string;
  };
}
```

**Step 2: Provide Values (Apps.Main)**
```typescript
// apps.main/module.ts
import { appsMainConstants } from './constants/implementations/apps.main.constants';

@NgModule({
  providers: [{
    provide: RESOURCE_PATHS,
    useValue: {
      logos: {
        light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
        dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
      }
    }
  }]
})
export class AppsMainModule {}
```

**Step 3: Consume in Sites Components**
```typescript
// sites/components/header/component.ts
import { RESOURCE_PATHS, ResourcePaths } from '../../../../../../../core/tokens/resource.tokens';

export class BaseAppsPagesLandingIndexHeaderComponent {
  constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
}
```

```html
<!-- sites/components/header/component.html -->
<img src="{{resources.logos.light}}" alt="logo light">
<img src="{{resources.logos.dark}}" alt="logo dark">
```

**Benefits**:
- ✅ Breaks upward dependency (Sites no longer imports Apps.Main)
- ✅ Testable (mock the token)
- ✅ Quick to implement (~2 hours)
- ✅ Enables library extraction

---

### Option B: Service Abstraction (Better - 4 hours)

```typescript
// core/services/resource.service.ts
@Injectable({ providedIn: 'root' })
export abstract class ResourceService {
  abstract getLogoPath(variant: 'light' | 'dark'): string;
  abstract getImagePath(category: string, filename: string): string;
}

// apps.main/services/apps-main-resource.service.ts
@Injectable()
export class AppsMainResourceService implements ResourceService {
  getLogoPath(variant: 'light' | 'dark'): string {
    return `${appsMainConstants.resources.open.images.logos}logo-${variant}.png`;
  }
  
  getImagePath(category: string, filename: string): string {
    const base = appsMainConstants.resources.open.images.root;
    return `${base}${category}/${filename}`;
  }
}

// apps.main/module.ts
providers: [{
  provide: ResourceService,
  useClass: AppsMainResourceService
}]

// sites/components/header/component.ts
constructor(private resources: ResourceService) {}
logoLightPath = this.resources.getLogoPath('light');
```

**Benefits**:
- ✅ All benefits of Option A
- ✅ More flexible (can switch implementations)
- ✅ Better encapsulation (hides path structure)
- ✅ Easier to extend (add methods without changing interface)

---

## Migration Plan

### Phase 1: Quick Fix (Now - 2 hours)
1. Create `RESOURCE_PATHS` injection token
2. Update Apps.Main module to provide values
3. Update Header component to inject token
4. Update Footer component to inject token
5. Test logos display correctly
6. Remove direct `appsConfiguration.constants` / `appsMainConstants` references

### Phase 2: Proper Abstraction (Later - 4 hours)
1. Create abstract `ResourceService`
2. Implement `AppsMainResourceService`
3. Update providers in Apps.Main module
4. Migrate components from token to service
5. Add tests for service

### Phase 3: Expand Pattern (Ongoing)
1. Apply same pattern to API URLs
2. Apply same pattern to navigation URLs
3. Document pattern in architecture guide
4. Update other components using same anti-pattern

---

## Testing Checklist

### After Phase 1 (Token)
- [ ] Header logo-light displays correctly
- [ ] Header logo-dark displays correctly
- [ ] Footer logo-light displays correctly
- [ ] No 404s in browser console
- [ ] Sites components compile without Apps.Main imports
- [ ] Unit tests pass with mocked token

### After Phase 2 (Service)
- [ ] Service unit tests pass
- [ ] Service integration tests pass
- [ ] Component tests use service mock
- [ ] Coverage >80%

---

## Related Documentation

- **Roadmaps**:
  - `architectural-recovery-plan.md` - Phase 3.3
  - `library-extraction-roadmap.md` - Phase 1.4

- **Components**:
  - `sites/features/pages/landing/_sharedparts/components/header/component.ts`
  - `sites/features/pages/information/components/index/components/footer/component.ts`

- **Constants**:
  - `apps.main/constants/implementations/apps.main.constants.ts`
  - `apps/configuration/implementations/apps.configuration.ts`

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-01-XX | Document as debt | Causing 404s, need to track properly |
| 2025-01-XX | Choose Option A first | Quick win, unblocks immediate issue |
| TBD | Migrate to Option B | Better architecture, do in Phase 3 |

---

**Next Action**: Create `RESOURCE_PATHS` injection token (Phase 1 - 2 hours)  
**Owner**: [Your Name]  
**Target Date**: [This Week]

