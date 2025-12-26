# Quick Migration Guide: Direct Imports → DI Injection

**Time to migrate one component**: ~5 minutes  
**Pattern**: Resource Injection (see `resource-injection-pattern.md` for full details)

---

## Quick Reference

### Before (❌ Wrong)
```typescript
import { appsMainConstants } from 'apps.main/constants';

export class MyComponent {
  public appsMainConstants = appsMainConstants;
}
```
```html
<img src="{{appsMainConstants.resources.open.images.logos}}logo-light.png">
```

### After (✅ Correct)
```typescript
import { RESOURCE_PATHS, ResourcePaths } from 'core/tokens';

export class MyComponent {
  public resources: ResourcePaths;
  
  constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) {
    this.resources = resources;
  }
}
```
```html
<img src="{{resources.logos.light}}">
```

---

## 3-Step Migration

### 1. Update Component (.ts)

**Add imports:**
```typescript
import { Component, Inject } from '@angular/core'; // Add Inject
import { RESOURCE_PATHS, ResourcePaths } from 'core/tokens'; // Add token
```

**Remove old imports:**
```typescript
// ❌ Delete this:
import { appsMainConstants } from 'apps.main/constants';
```

**Add property + inject:**
```typescript
export class MyComponent {
  public resources: ResourcePaths; // Add this
  
  constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) { // Add injection
    this.resources = resources; // Store it
  }
  
  // ❌ Delete this:
  // public appsMainConstants = appsMainConstants;
}
```

---

### 2. Update Template (.html)

**Find & replace:**
```
Find:    appsMainConstants.resources.open.images.logos}}logo-light.png
Replace: resources.logos.light}}

Find:    appsMainConstants.resources.open.images.logos}}logo-dark.png
Replace: resources.logos.dark}}
```

**Path mappings:**
| Old Path | New Path |
|----------|----------|
| `appsMainConstants.resources.open.images.logos}}logo-light.png` | `resources.logos.light}}` |
| `appsMainConstants.resources.open.images.logos}}logo-dark.png` | `resources.logos.dark}}` |
| `appsMainConstants.resources.open.images.root` | `resources.images.root` |
| `appsMainConstants.resources.open.images.trustedBy` | `resources.images.trustedBy` |
| `appsMainConstants.resources.open.files.root` | `resources.files.root` |

---

### 3. Verify

```bash
# Build should succeed:
ng build

# No errors should mention appsMainConstants in your component
# Autocomplete should work on resources.logos. etc.
```

---

## Common Components to Migrate

Priority order (by traffic/visibility):

1. ✅ **Header** - `sites/features/pages/landing/_sharedparts/components/header/component.ts` (DONE)
2. ⏳ **Footer** - `sites/features/pages/information/components/index/components/footer/component.ts`
3. ⏳ **Landing pages** - Any component importing `appsMainConstants`
4. ⏳ **Dashboard** - Any component importing `appsConfiguration.constants`

---

## Testing Your Changes

```typescript
// In your spec file:
import { RESOURCE_PATHS } from 'core/tokens';

const mockResources = {
  logos: { light: '/test/logo.png', dark: '/test/logo.png' },
  images: { root: '/test/', trustedBy: '/test/', flags: '/test/', backgrounds: '/test/' },
  files: { root: '/test/', markdown: '/test/', pdf: '/test/' }
};

TestBed.configureTestingModule({
  providers: [
    { provide: RESOURCE_PATHS, useValue: mockResources }
  ]
});
```

---

## Get Help

- Full pattern docs: `_custom/documentation/patterns/resource-injection-pattern.md`
- Example component: `sites/features/pages/landing/_sharedparts/components/header/component.ts`
- Ask team: #architecture channel
