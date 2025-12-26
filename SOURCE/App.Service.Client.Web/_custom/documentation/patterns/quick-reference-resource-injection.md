# 🚀 Quick Reference: Resource Injection Pattern

> **When to use**: Any time a component needs resource paths (logos, images, files)  
> **Why**: Breaks upward coupling, enables testing, preserves autocomplete

---

## ⚡ Quick Usage

### In Your Component (.ts)

```typescript
import { Component, Inject } from '@angular/core';
import { RESOURCE_PATHS, ResourcePaths } from 'core/tokens';

export class MyComponent {
  public resources: ResourcePaths;
  
  constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) {
    this.resources = resources;
  }
}
```

### In Your Template (.html)

```html
<img src="{{resources.logos.light}}" alt="logo">
<img src="{{resources.logos.dark}}" alt="logo">
```

---

## 📦 Available Paths

```typescript
resources.logos.light        // Logo for light theme
resources.logos.dark         // Logo for dark theme
resources.images.root        // Images root directory
resources.images.trustedBy   // Partner/trusted logos
resources.images.flags       // Country/language flags
resources.images.backgrounds // Background images
resources.files.root         // Files root directory
resources.files.markdown     // Markdown documents
resources.files.pdf          // PDF documents
```

---

## ❌ Don't Do This (Anti-Pattern)

```typescript
// ❌ WRONG: Direct import from higher tier
import { appsMainConstants } from 'apps.main/constants';

export class MyComponent {
  public appsMainConstants = appsMainConstants; // Upward coupling!
}
```

```html
<!-- ❌ WRONG: Using constants directly -->
<img src="{{appsMainConstants.resources.open.images.logos}}logo.png">
```

---

## ✅ Do This Instead

```typescript
// ✅ CORRECT: Inject from Core tier
import { RESOURCE_PATHS, ResourcePaths } from 'core/tokens';

export class MyComponent {
  constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
}
```

```html
<!-- ✅ CORRECT: Use injected resources -->
<img src="{{resources.logos.light}}">
```

---

## 🧪 Testing

```typescript
import { RESOURCE_PATHS } from 'core/tokens';

TestBed.configureTestingModule({
  providers: [
    {
      provide: RESOURCE_PATHS,
      useValue: {
        logos: { light: '/test/logo.png', dark: '/test/logo.png' },
        images: { root: '/test/', trustedBy: '/test/', flags: '/test/', backgrounds: '/test/' },
        files: { root: '/test/', markdown: '/test/', pdf: '/test/' }
      }
    }
  ]
});
```

---

## 🔍 Checklist

- [ ] Import `RESOURCE_PATHS` from `core/tokens` (not apps.main!)
- [ ] Add `Inject` to Angular imports
- [ ] Declare `public resources: ResourcePaths;` property
- [ ] Inject in constructor: `@Inject(RESOURCE_PATHS) resources`
- [ ] Assign in constructor: `this.resources = resources;`
- [ ] Update template to use `resources.logos.*` etc.
- [ ] Remove old `appsMainConstants` import
- [ ] Build succeeds: `ng build`

---

## 📚 Full Documentation

- **Pattern Guide**: `_custom/documentation/patterns/resource-injection-pattern.md`
- **Migration Guide**: `_custom/documentation/patterns/migration-guide-resource-injection.md`
- **Example**: `sites/features/pages/landing/_sharedparts/components/header/component.ts`

---

## 💡 Benefits

| Benefit | Description |
|---------|-------------|
| ✅ **Correct Architecture** | Sites → Core (not Sites → Apps.Main) |
| ✅ **Testable** | Mock token in unit tests |
| ✅ **Flexible** | Swap implementations per environment |
| ✅ **Autocomplete** | TypeScript interfaces preserve hints |
| ✅ **Maintainable** | Change paths in one place |

---

## 🆘 Need Help?

- Read: `resource-injection-pattern.md` (comprehensive)
- Example: `header/component.ts` (working code)
- Ask: #architecture channel

---

**Remember**: Always inject from Core tier, never import from higher tiers! 🎯
