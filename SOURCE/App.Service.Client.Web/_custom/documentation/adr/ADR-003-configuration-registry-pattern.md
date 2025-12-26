# ADR-003: Configuration Registry Pattern

**Date**: 2025-01-25  
**Status**: ✅ **Accepted**  
**Context**: Apps.Bootstrap contains hardcoded config for all tiers

---

## 🎯 **Problem Statement**

### **Current Architecture (Code Smell):**

```typescript
// ❌ apps.bootstrap/module.ts

@NgModule({
  providers: [
    {
      provide: SOME_TOKEN,
      useValue: {
        sites: { landing: { pricing: '/pricing' } },    // ← Bootstrap knows sites!
        apps: { dashboards: { main: '/main' } },         // ← Bootstrap knows apps!
        applets: { education: { courses: '/courses' } }, // ← Bootstrap knows applets!
        purchases: { checkout: '/checkout' }             // ← Might not even load!
      }
    }
  ]
})
export class BootstrapModule {}
```

**Problems:**
1. ❌ **Tight Coupling** - Bootstrap imports types from Sites/Apps/Applets
2. ❌ **Circular Dependency Risk** - Sites imports Bootstrap, Bootstrap knows Sites
3. ❌ **Not Lazy-Load Friendly** - All config loaded upfront, even for unloaded modules
4. ❌ **Hard to Extend** - Providers can't add custom applets without modifying Bootstrap
5. ❌ **Violates SRP** - Bootstrap should bootstrap, not know about all tiers

---

## ✅ **Solution: Configuration Registry Pattern**

### **Core Principle:**

> **"Modules register themselves. Bootstrap knows nothing."**

### **Pattern:**

```typescript
// ✅ apps.bootstrap - Just provides registry (knows nothing)
@NgModule({
  providers: [ConfigRegistryService]
})
export class BootstrapModule {}

// ✅ sites - Registers own config
export class SitesModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('sites', sitesConfig);
  }
}

// ✅ Education applet (lazy loaded) - Registers when loaded
export class EducationModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.education', educationConfig);
  }
}
```

---

## 🏗️ **Architecture**

### **Registry Service:**

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigRegistryService {
  private registry = new Map<string, any>();
  
  // Modules register themselves:
  register(namespace: string, config: any): void {
    this.registry.set(namespace, config);
  }
  
  // Components request what they need:
  get<T>(namespace: string): T | undefined {
    return this.registry.get(namespace) as T;
  }
  
  // Autocomplete helper:
  getAll(): AppConfig {
    return {
      sites: this.get('sites'),
      apps: this.get('apps'),
      applets: this.get('applets')
    } as AppConfig;
  }
}
```

---

## 🎯 **Benefits**

### **1. Zero Coupling in Bootstrap** ✅

```typescript
// Bootstrap doesn't import from any tier:
import { ConfigRegistryService } from './services/config-registry.service';

@NgModule({
  providers: [ConfigRegistryService]  // ← Just the registry
})
export class BootstrapModule {}

// No imports from sites/apps/applets! ✅
```

---

### **2. Modules Self-Register** ✅

```typescript
// Each module is self-contained:
export class SitesModule {
  constructor(configRegistryService: ConfigRegistryService) {
    // Sites owns its config:
    configRegistryService.register('sites', {
      navigation: { landing: { pricing: '/pricing' } },
      apis: { brochure: '/api/sites/brochure' }
    });
  }
}
```

---

### **3. Lazy-Load Compatible** ✅

```typescript
// Applet registers when lazy-loaded:
const routes = [{
  path: 'education',
  loadChildren: () => import('./education/module').then(m => m.EducationModule)
}];

// Module constructor runs when loaded:
export class EducationModule {
  constructor(configRegistryService: ConfigRegistryService) {
    // Registers now, not at bootstrap! ✅
    configRegistryService.register('applets.education', educationConfig);
  }
}
```

---

### **4. Still Great Autocomplete** ✅

```typescript
// Typed interface for IntelliSense:
export interface AppConfig {
  sites?: SitesConfig;
  apps?: AppsConfig;
  applets?: {
    education?: EducationConfig;
    scheduling?: SchedulingConfig;
  };
}

// Usage in component:
constructor(configRegistryService: ConfigRegistryService) {
  // ✅ Full autocomplete:
  const config = configRegistryService.getAll();
  const url = config.sites.navigation.landing.pricing;
}
```

---

### **5. Provider Extensible** ✅

```typescript
// Provider A enables: Education + Scheduling
// (Modules load and register themselves)

// Provider B enables: Education + Custom Applet
// (Custom applet registers on load)

// Bootstrap unchanged! ✅
```

---

## 📊 **Comparison**

| Aspect | Uber Config | Registry Pattern |
|--------|-------------|------------------|
| **Bootstrap coupling** | High (imports all) ❌ | Zero (imports none) ✅ |
| **Circular dependency risk** | High ❌ | None ✅ |
| **Lazy-load friendly** | No ❌ | Yes ✅ |
| **Adding new applet** | Modify bootstrap ❌ | Just register ✅ |
| **Provider customization** | Hard ❌ | Easy ✅ |
| **Autocomplete** | Perfect ✅ | Perfect ✅ |
| **Maintainability** | Low ❌ | High ✅ |

---

## 🎯 **Design Principles Applied**

### **1. Dependency Inversion Principle**

```
High-level modules should not depend on low-level modules.
Both should depend on abstractions.
```

**Before:**
```
Bootstrap → depends on → Sites/Apps/Applets (concrete) ❌
```

**After:**
```
Bootstrap → provides → ConfigRegistryService (abstraction) ✅
Sites/Apps/Applets → register with → ConfigRegistryService (abstraction) ✅
```

---

### **2. Single Responsibility Principle**

```
A module should have one reason to change.
```

**Before:**
- Bootstrap changes when Sites changes ❌
- Bootstrap changes when Apps changes ❌
- Bootstrap changes when new Applet added ❌

**After:**
- Bootstrap only changes for bootstrap concerns ✅
- Sites only changes for sites concerns ✅
- New Applets register themselves (no changes needed) ✅

---

### **3. Open/Closed Principle**

```
Open for extension, closed for modification.
```

**Before:**
- Adding applet = modify Bootstrap ❌

**After:**
- Adding applet = just register (Bootstrap unchanged) ✅

---

## 📋 **Implementation Plan**

### **Phase 1: Create Registry Service** (30 min)

```typescript
// core/services/config-registry.service.ts
@Injectable({ providedIn: 'root' })
export class ConfigRegistryService {
  private registry = new Map<string, any>();
  
  register(namespace: string, config: any): void { ... }
  get<T>(namespace: string): T | undefined { ... }
  getAll(): AppConfig { ... }
}
```

---

### **Phase 2: Modules Self-Register** (2 hours)

```typescript
// Each module registers in constructor:
export class SitesModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('sites', sitesConfig);
  }
}
```

---

### **Phase 3: Remove Uber Config** (1 hour)

```typescript
// apps.bootstrap/module.ts

// ❌ REMOVE hardcoded providers:
{
  provide: SOME_TOKEN,
  useValue: { sites: {...}, apps: {...} }
}

// ✅ KEEP just registry:
providers: [ConfigRegistryService]
```

---

### **Phase 4: Update Components** (2 hours)

```typescript
// Components use registry:
constructor(configRegistryService: ConfigRegistryService) {
  const sitesConfig = configRegistryService.get<SitesConfig>('sites');
}
```

---

## 🚨 **Risks & Mitigations**

### **Risk 1: Module Load Order**

**Problem:** Component requests config before module registers it.

**Mitigation:**
```typescript
// Check if config exists:
const config = configRegistryService.get<SitesConfig>('sites');
if (!config) {
  console.warn('Sites config not yet registered!');
  return;
}
```

---

### **Risk 2: Namespace Collisions**

**Problem:** Two modules try to register same namespace.

**Mitigation:**
```typescript
register(namespace: string, config: any): void {
  if (this.registry.has(namespace)) {
    console.warn(`Config namespace '${namespace}' already registered!`);
  }
  this.registry.set(namespace, config);
}
```

---

### **Risk 3: Migration Effort**

**Problem:** Many components use old pattern.

**Mitigation:**
- Phase migration (both patterns work temporarily)
- Automated search/replace for common patterns
- Comprehensive documentation

---

## 💡 **Key Insights**

### **Observation from Developer:**

> "Code smell that app.config contains configs for pages and purchases when we don't yet know if we are loading those."

**Analysis:** CORRECT! Bootstrap shouldn't know about modules that might not load.

### **Solution Validation:**

> "Second approach permits not having to make an interface in Base that matches shape of every other module it shouldn't know much about. Right? So it's far more loosely coupled."

**Analysis:** EXACTLY! Registry = loose coupling, Uber Config = tight coupling.

### **Intentional vs. Accidental Coupling:**

> "If they have to ask for settings in a lower tier, they probably can go get it as a deliberate act."

**Analysis:** PERFECT! Deliberate dependency (good) vs. accidental coupling (bad).

---

## 🎯 **Decision**

### **We Choose: Configuration Registry Pattern**

**Rationale:**
1. ✅ Eliminates tight coupling in Bootstrap
2. ✅ Supports lazy loading
3. ✅ Enables provider customization
4. ✅ Maintains great developer experience (autocomplete)
5. ✅ Follows SOLID principles
6. ✅ Industry-standard pattern

---

## 📚 **References**

- **Pattern**: Service Locator / Registry Pattern
- **Similar**: Angular's `Injector`, Spring's `ApplicationContext`
- **Principle**: Dependency Inversion (SOLID)

---

## ✅ **Success Criteria**

**Phase 1 Complete When:**
- [ ] ConfigRegistryService created
- [ ] Modules register themselves
- [ ] Bootstrap has no tier imports
- [ ] Tests pass

**Phase 2 Complete When:**
- [ ] All components migrated
- [ ] Uber config removed
- [ ] Documentation updated
- [ ] Team trained

---

**Status**: ✅ Accepted - Ready for implementation  
**Risk Level**: Low (well-established pattern)  
**Estimated Effort**: 6 hours total  
**Business Value**: High (SaaS-ready, maintainable)

---

**Version**: 1.0  
**Created**: 2025-01-25  
**Next Review**: After Phase 1 complete
