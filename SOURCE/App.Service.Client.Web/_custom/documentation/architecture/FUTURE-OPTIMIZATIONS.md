# Future Optimization Ideas

## Lazy-Loaded Configuration with inject()

### Current Limitation:
Config is copied at build time into theme/site/app configs. Lazy-loaded modules get stale config if:
- User updates config.json
- Module loads after config changes

### Proposed Solution (Angular 14+):
Use **getter pattern with `inject()` ServiceLocator**

```typescript
// themes/t1/configuration/implementations/themes.t1.configuration.ts

import { inject } from '@angular/core';
import { EnvConfigService } from '../../../../core/services/env-config.service';

export const themesT1Configuration: TThemesT1Configuration = {
  description: 'Began as Velzone',
  constants: themesT1Constants,
  navigation: themesT1ConfigurationNavigation,
  others: themesT1ConfigurationOthers,
  
  postLoginRedirect: '/dashboards/main/',
  
  // ✅ FUTURE: Dynamic branding (always fresh from EnvConfigService)
  get branding() {
    // ⚠️ Note: inject() only works in injection context (Angular 14+)
    // This is similar to ServiceLocator pattern
    const envConfig = inject(EnvConfigService);
    const runtimeConfig = envConfig.get();
    
    // Runtime override or fall back to app config
    return {
      logoPath: runtimeConfig.branding?.logoPath || appsConfiguration.constants.resources.open.images.logos,
      appTitle: runtimeConfig.branding?.appTitle || appsConfiguration.description.title,
      appDescription: runtimeConfig.branding?.appDescription || appsConfiguration.description.description,
    };
  }
}
```

### Benefits:
- ✅ **Always fresh** - Config pulled on-demand (not stale copy)
- ✅ **Lazy-load safe** - Works even if module loads after config updates
- ✅ **Runtime overrides** - config.json can override branding
- ✅ **No component changes** - Components still use `tierConfig.branding`

### Trade-offs:
- ⚠️ **Angular 14+ required** - `inject()` outside constructors is newer feature
- ⚠️ **ServiceLocator pattern** - Some consider this anti-pattern (vs explicit DI)
- ⚠️ **Performance** - Getter called every access (vs one-time copy)

### When to Implement:
- After upgrading to Angular 14+
- When lazy-loaded modules need dynamic branding
- When config changes need to affect already-loaded modules

### Alternative (without inject()):
Pass `EnvConfigService` to every component constructor:
```typescript
constructor(private envConfig: EnvConfigService) {
  this.branding = this.getBranding();
}

private getBranding() {
  const config = this.envConfig.get();
  return config.branding || defaultBranding;
}
```

But this adds boilerplate to every component (defeats purpose of tier config pattern).

---

## ServiceLocator Pattern Notes

**What is it?**
- Design pattern where objects ask a "locator" for dependencies
- vs Dependency Injection: dependencies passed explicitly

**Example**:
```typescript
// ServiceLocator (implicit)
const envConfig = inject(EnvConfigService);  // ← Ask locator for service

// vs Dependency Injection (explicit)
constructor(private envConfig: EnvConfigService) {}  // ← Receive service
```

**Pros**:
- Flexible (can get dependencies anywhere, not just constructors)
- Useful for library code / config objects
- Reduces boilerplate in some cases

**Cons**:
- Hidden dependencies (harder to test/mock)
- "Magic" - where did this service come from?
- Can lead to tight coupling if overused

**Angular's `inject()`**:
- Modern take on ServiceLocator
- Only works in injection context (limits abuse)
- Balances flexibility with explicit DI

**When OK in our case**:
- Config objects aren't components (can't use constructor DI)
- Need dynamic values (can't be static at build time)
- Alternative is worse (pass EnvConfigService to every component)

---

Last Updated: 2025-12-26
