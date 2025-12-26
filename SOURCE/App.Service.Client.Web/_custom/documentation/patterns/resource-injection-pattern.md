# Resource Injection Pattern

**Status**: ✅ **IMPLEMENTED** - Production ready  
**Created**: 2025-01-XX  
**Pattern Type**: Dependency Injection, Architectural  
**Tier**: Core → Apps.Main → Sites

---

## Overview

The **Resource Injection Pattern** uses Angular's Dependency Injection to provide resource paths (logos, images, files) to components without creating upward tier coupling.

### Problem It Solves

**Before (Anti-Pattern)**:
```typescript
// ❌ WRONG: Sites component imports Apps.Main constants
import { appsMainConstants } from 'apps.main/constants';

export class HeaderComponent {
  public appsMainConstants = appsMainConstants; // Upward coupling
}
```

```html
<!-- ❌ WRONG: Template uses Apps.Main constants -->
<img src="{{appsMainConstants.resources.open.images.logos}}logo-light.png">
```

**Issues**:
- ❌ Violates tier architecture (Sites → Apps.Main upward coupling)
- ❌ Untestable (can't mock hardcoded imports)
- ❌ Blocks library extraction (Sites can't be standalone)
- ❌ Brittle (path changes break multiple components)

**After (Correct Pattern)**:
```typescript
// ✅ CORRECT: Sites component injects Core token
import { RESOURCE_PATHS, ResourcePaths } from 'core/tokens';

export class HeaderComponent {
  constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
}
```

```html
<!-- ✅ CORRECT: Template uses injected resources -->
<img src="{{resources.logos.light}}">
```

**Benefits**:
- ✅ Follows tier architecture (Core defines, Apps.Main provides, Sites consumes)
- ✅ Testable (mock token in unit tests)
- ✅ Flexible (swap implementations per environment)
- ✅ Maintainable (change paths in one place)
- ✅ Autocomplete preserved (TypeScript interfaces)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Core Tier (Lowest)                                      │
│ - Defines: RESOURCE_PATHS token                         │
│ - Defines: ResourcePaths interface                      │
│ - Provides: Contract only (no implementation)           │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ imports token
                          │
┌─────────────────────────┼───────────────────────────────┐
│ Apps.Main Tier          │                               │
│ - Imports: RESOURCE_PATHS token from Core               │
│ - Provides: Concrete values in module                   │
│ - Maps: appsMainConstants → token values                │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ injects token
                          │
┌─────────────────────────┼───────────────────────────────┐
│ Sites Tier              │                               │
│ - Imports: RESOURCE_PATHS token from Core               │
│ - Injects: Token in component constructor               │
│ - Uses: resources.logos.light in template               │
└─────────────────────────────────────────────────────────┘
```

**Key Point**: Sites never imports Apps.Main, only Core (which is the correct dependency direction)

---

## Implementation Guide

### Step 1: Define Token in Core

**File**: `src/core/tokens/resource.tokens.ts`

```typescript
import { InjectionToken } from '@angular/core';

export interface ResourcePaths {
  logos: {
    light: string;
    dark: string;
  };
  images: {
    root: string;
    trustedBy: string;
    flags: string;
    backgrounds: string;
  };
  files: {
    root: string;
    markdown: string;
    pdf: string;
  };
}

export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>(
  'resource.paths'
);
```

**Export in barrel**: `src/core/tokens/index.ts`
```typescript
export * from './resource.tokens';
```

---

### Step 2: Provide Values in Apps.Main

**File**: `src/apps.main/module.ts`

```typescript
import { RESOURCE_PATHS } from "../core/tokens";
import { appsMainConstants } from "./constants/implementations/apps.main.constants";

@NgModule({
  providers: [
    {
      provide: RESOURCE_PATHS,
      useValue: {
        logos: {
          light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
          dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
        },
        images: {
          root: appsMainConstants.resources.open.images.root,
          trustedBy: appsMainConstants.resources.open.images.trustedBy,
          flags: appsMainConstants.resources.open.images.flags,
          backgrounds: appsMainConstants.resources.open.images.backgrounds
        },
        files: {
          root: appsMainConstants.resources.open.files.root,
          markdown: appsMainConstants.resources.open.files.markdownDir,
          pdf: appsMainConstants.resources.open.files.pdfDir
        }
      }
    }
  ]
})
export class AppModule {}
```

---

### Step 3: Inject in Sites Component

**File**: `src/sites/components/header/component.ts`

```typescript
import { Component, Inject } from '@angular/core';
import { RESOURCE_PATHS, ResourcePaths } from '../../../core/tokens';

@Component({
  selector: 'app-header',
  templateUrl: './component.html'
})
export class HeaderComponent {
  // Store injected resources as public property for template access
  public resources: ResourcePaths;

  constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) {
    this.resources = resources;
  }
}
```

**Note**: Make `resources` public so template can access it

---

### Step 4: Use in Template

**File**: `src/sites/components/header/component.html`

```html
<!-- Simple property access (autocomplete works!) -->
<img src="{{resources.logos.light}}" alt="logo">
<img src="{{resources.logos.dark}}" alt="logo">

<!-- Or use property binding -->
<img [src]="resources.logos.light" alt="logo">
```

---

## Testing

### Unit Test Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RESOURCE_PATHS } from 'core/tokens';
import { HeaderComponent } from './component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  // ✅ Mock resource paths for testing
  const mockResources = {
    logos: {
      light: '/test/logo-light.png',
      dark: '/test/logo-dark.png'
    },
    images: {
      root: '/test/images/',
      trustedBy: '/test/trusted/',
      flags: '/test/flags/',
      backgrounds: '/test/backgrounds/'
    },
    files: {
      root: '/test/files/',
      markdown: '/test/markdown/',
      pdf: '/test/pdf/'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        // Provide mock values for testing
        { provide: RESOURCE_PATHS, useValue: mockResources }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should inject resource paths', () => {
    expect(component.resources).toBe(mockResources);
  });

  it('should display correct logo paths', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const img = compiled.querySelector('img');
    expect(img.src).toContain('/test/logo-light.png');
  });
});
```

---

## Migration Checklist

When converting an existing component from direct imports to injection:

### Component File (.ts)

- [ ] Add `Inject` to Angular imports
  ```typescript
  import { Component, Inject } from '@angular/core';
  ```

- [ ] Import token from Core (not Apps.Main!)
  ```typescript
  import { RESOURCE_PATHS, ResourcePaths } from 'core/tokens';
  ```

- [ ] Remove Apps.Main constant imports
  ```typescript
  // ❌ Remove this:
  import { appsMainConstants } from 'apps.main/constants';
  ```

- [ ] Add public property for resources
  ```typescript
  public resources: ResourcePaths;
  ```

- [ ] Inject in constructor
  ```typescript
  constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) {
    this.resources = resources;
  }
  ```

- [ ] Remove old constant properties
  ```typescript
  // ❌ Remove this:
  public appsMainConstants = appsMainConstants;
  ```

### Template File (.html)

- [ ] Replace constant paths with injected properties
  ```html
  <!-- ❌ Before: -->
  <img src="{{appsMainConstants.resources.open.images.logos}}logo-light.png">
  
  <!-- ✅ After: -->
  <img src="{{resources.logos.light}}">
  ```

- [ ] Test autocomplete still works (should!)

### Verification

- [ ] Build succeeds: `ng build`
- [ ] No compilation errors
- [ ] Component no longer imports Apps.Main
- [ ] Template displays images correctly
- [ ] Unit tests pass with mocked token

---

## Common Patterns

### Multiple Tokens in One Component

```typescript
constructor(
  @Inject(RESOURCE_PATHS) public resources: ResourcePaths,
  @Inject(API_ENDPOINTS) public apis: ApiEndpoints,
  @Inject(FEATURE_FLAGS) public features: FeatureFlags
) {}
```

### Optional Injection (with Fallback)

```typescript
constructor(
  @Optional() @Inject(RESOURCE_PATHS) resources?: ResourcePaths
) {
  this.resources = resources ?? {
    logos: { light: '/default/logo.png', dark: '/default/logo.png' },
    // ... defaults
  };
}
```

### Factory Provider (Dynamic Values)

```typescript
// In Apps.Main module:
{
  provide: RESOURCE_PATHS,
  useFactory: (env: Environment) => ({
    logos: {
      light: `${env.cdnUrl}/logos/logo-light.png`,
      dark: `${env.cdnUrl}/logos/logo-dark.png`
    },
    // ...
  }),
  deps: [ENVIRONMENT]
}
```

---

## Extending the Pattern

### Adding New Resource Types

**Step 1**: Update interface in Core
```typescript
// core/tokens/resource.tokens.ts
export interface ResourcePaths {
  logos: { light: string; dark: string };
  images: { /* existing */ };
  files: { /* existing */ };
  
  // ✅ Add new section:
  videos: {
    intro: string;
    demo: string;
  };
}
```

**Step 2**: Update provider in Apps.Main
```typescript
// apps.main/module.ts
{
  provide: RESOURCE_PATHS,
  useValue: {
    // ...existing values...
    videos: {
      intro: `${appsMainConstants.resources.open.videos}intro.mp4`,
      demo: `${appsMainConstants.resources.open.videos}demo.mp4`
    }
  }
}
```

**Step 3**: Use in components
```typescript
// Autocomplete now includes videos!
<video src="{{resources.videos.intro}}"></video>
```

---

## Troubleshooting

### "No provider for InjectionToken resource.paths"

**Cause**: Token not provided in module  
**Fix**: Add provider to Apps.Main module (see Step 2)

### "Property 'resources' does not exist"

**Cause**: Property not declared or not public  
**Fix**: Add `public resources: ResourcePaths;` in component

### "Cannot read property 'logos' of undefined"

**Cause**: Constructor assignment missing  
**Fix**: Add `this.resources = resources;` in constructor

### Autocomplete not working

**Cause**: TypeScript doesn't know the type  
**Fix**: Ensure property is typed: `public resources: ResourcePaths;`

---

## Best Practices

### ✅ DO

- Define tokens in Core tier (lowest level)
- Provide values in Apps.Main module
- Inject in component constructors
- Use TypeScript interfaces for autocomplete
- Write unit tests with mocked tokens
- Document token usage in component comments

### ❌ DON'T

- Import constants directly in components
- Define tokens in higher tiers (Apps.Main, Sites)
- Use `any` type for injected values
- Bypass DI with static imports
- Provide same token in multiple modules (causes conflicts)

---

## Performance Considerations

- **Zero overhead**: DI resolution happens once at component creation
- **Tree-shakeable**: Unused tokens don't increase bundle size
- **Type-safe**: No runtime type checking needed
- **Memory efficient**: Single instance shared across components

---

## Comparison with Alternatives

| Approach | Pros | Cons | Use When |
|----------|------|------|----------|
| **Injection Token** (This) | ✅ Loosely coupled<br>✅ Testable<br>✅ Flexible | ⚠️ More setup | Always for cross-tier config |
| **Direct Import** | ✅ Simple<br>✅ Quick | ❌ Tight coupling<br>❌ Untestable | Never (anti-pattern) |
| **Service Abstraction** | ✅ Very flexible<br>✅ Encapsulated | ⚠️ More code | Complex logic needed |
| **Environment File** | ✅ Simple | ❌ Global scope<br>❌ Not tier-specific | Build-time constants only |

---

## Related Patterns

- **Service Abstraction Pattern**: Use when logic is needed (not just paths)
- **Factory Provider Pattern**: Use when values are computed dynamically
- **Multi-Provider Pattern**: Use when collecting values from multiple sources

---

## Next Steps

1. Apply pattern to Footer component (see `footer/component.ts`)
2. Create `API_ENDPOINTS` token for API URLs
3. Create `NAVIGATION_PATHS` token for route URLs
4. Document pattern in team onboarding guide

---

## References

- **Angular DI Guide**: https://angular.io/guide/dependency-injection
- **Injection Tokens**: https://angular.io/api/core/InjectionToken
- **Architectural Debt Doc**: `_custom/documentation/debt/resource-path-coupling.md`
- **Implementation Files**:
  - `src/core/tokens/resource.tokens.ts` (token definition)
  - `src/apps.main/module.ts` (provider)
  - `src/sites/components/header/component.ts` (consumer)

---

**Pattern Status**: ✅ Implemented and production-ready  
**Adoption**: Start with high-traffic components (header, footer)  
**Support**: Contact architecture team for assistance
