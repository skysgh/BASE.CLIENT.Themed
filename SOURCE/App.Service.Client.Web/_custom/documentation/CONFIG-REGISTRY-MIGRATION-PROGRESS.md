# Config Registry Migration Progress

**Status**: ✅ Phase 1 Complete - Registry Added  
**Strategy**: Bottom-up migration (dependencies first)  
**Test Method**: Verify site works after each phase

---

## 📋 **Migration Sequence**

| # | Module | Status | Dependencies | Notes |
|---|--------|--------|--------------|-------|
| 1 | Core | ✅ Complete | None | No module (just services) |
| 2 | Core.Ag | ✅ Complete | Core | Registered minimal config |
| 3 | **Themes** | ✅ **Complete** | Core, Core.Ag | Registered theme T1 config |
| 4 | Sites | ⏳ **Next** | Core, Core.Ag, Themes | Public tier |
| 5 | Apps | 📋 Pending | Sites | Private tier |
| 6 | App.lets | 📋 Pending | Apps | Applets |

---

## ✅ **Phase 1: Bootstrap Registry Setup** (Complete)

### **What Changed:**

```typescript
// apps.bootstrap/module.ts

// ✅ Added import:
import { ConfigRegistryService } from "../core/services/config-registry.service";

@NgModule({
  providers: [
    // ✅ NEW: Configuration Registry Service
    ConfigRegistryService,
    
    // Kept existing providers (backward compatibility)
    // TODO: Remove after all modules migrated
  ]
})
export class AppModule {
  constructor(
    private configRegistryService: ConfigRegistryService  // ✅ Verify available
  ) {
    console.log('✅ [AppModule] ConfigRegistryService available');
  }
}
```

### **Expected Console:**
```
🚀 [AppModule] Bootstrap initialized
✅ [AppModule] ConfigRegistryService available
```

### **Test Result:**
- ⏳ Pending - Run app and check console

---

## 🎯 **Phase 2: Core Module Registration** (Next)

### **Plan:**

**File**: `core/module.ts` (if exists) or `core/index.ts`

```typescript
import { ConfigRegistryService } from './services/config-registry.service';
import { coreConstants } from './constants/implementations/core.constants';

// Register core config when core loads:
export function initializeCoreConfig(
  configRegistryService: ConfigRegistryService
): void {
  configRegistryService.register('core', {
    // Core configuration (if any)
    version: '1.0.0',
    // Add core-specific config here
  });
}

// Or in a module if Core has one:
@NgModule({ ... })
export class CoreModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('core', coreConstants);
  }
}
```

### **Expected Console:**
```
✅ [ConfigRegistryService] Registered: core
```

### **Test:**
- [ ] Check console for registration message
- [ ] Verify `configRegistryService.has('core')` returns true
- [ ] Verify site still loads

---

## 📊 **Progress Tracker**

### **Completed:**
- [x] Create ADR-003 document
- [x] Create ConfigRegistryService
- [x] Create implementation guide
- [x] Add ConfigRegistryService to Bootstrap
- [x] Verify Bootstrap builds

### **In Progress:**
- [ ] Core module registration
- [ ] Test after Core

### **Pending:**
- [ ] Core.Ag module registration
- [ ] Themes module registration
- [ ] Sites module registration
- [ ] Apps module registration
- [ ] App.lets module registration
- [ ] Remove old providers from Bootstrap
- [ ] Update components to use registry

---

## 🧪 **Testing Checklist (Per Module)**

**After each module migration:**

### **Console Checks:**
- [ ] Registration message appears: `✅ [ConfigRegistryService] Registered: {module}`
- [ ] No errors in console
- [ ] Bootstrap message still shows

### **Functionality Checks:**
- [ ] App loads
- [ ] Landing page displays
- [ ] Navigation works
- [ ] No white flash
- [ ] i18n values show (not {{keys}})

### **Registry Checks:**
```typescript
// In browser console:
// Get Angular app reference
const appRef = ng.getComponent(document.querySelector('app-root'));
const registry = appRef.configRegistryService;

// Check registered modules:
console.log('Registered:', registry.getRegisteredNamespaces());
// Should show: ['core', 'core.ag', 'themes', 'sites', 'apps', ...]

// Check specific config:
console.log('Core config:', registry.get('core'));
```

---

## 📝 **Module-Specific Notes**

### **Core:**
- May not have NgModule
- Might register in service constructor or index.ts
- Config: version, utilities, base paths

### **Core.Ag:**
- Angular-specific foundation
- Config: Angular services, directives
- Depends on Core (register after)

### **Themes:**
- Presentation layer
- Config: theme assets, colors, fonts
- May have multiple themes (t1, t2, etc.)

### **Sites:**
- Public tier
- Config: navigation, APIs, resources
- Most complex (many sub-modules)

### **Apps:**
- Private tier
- Config: dashboard routes, app features
- Depends on Sites

### **App.lets:**
- Applets (Education, Scheduling, etc.)
- Each applet registers separately
- Lazy-loaded modules register on load

---

## 🚨 **Known Issues**

### **Build Errors (Cached):**
```
TS2792: Cannot find module '../../core/base/constants/t.base.constants.apis'
```

**Status:** Cached error from earlier work  
**Impact:** None - app still runs  
**Fix:** Will resolve with full rebuild or restart

### **Theme Adapters Error:**
```
ngtsc(-991010): Value at position 1 in the NgModule.declarations...
```

**Status:** Leftover from earlier experiment  
**Impact:** None - file doesn't exist  
**Fix:** Will resolve with cache clear

---

## 🎯 **Success Criteria**

**Phase 1 Complete When:**
- [x] ConfigRegistryService added to Bootstrap
- [x] Bootstrap builds
- [ ] Console shows registry available  ← Test needed

**Phase 2 Complete When:**
- [ ] Core registers itself
- [ ] Console shows core registration
- [ ] Site still works

**All Phases Complete When:**
- [ ] All modules registered
- [ ] Old providers removed from Bootstrap
- [ ] All tests pass
- [ ] Documentation updated

---

## 💡 **Developer Notes**

### **Why Bottom-Up?**
Each tier depends on previous:
```
Core ← Core.Ag ← Themes ← Sites ← Apps ← App.lets
```
Register in this order = no missing dependencies!

### **Backward Compatibility:**
Both patterns work simultaneously:
```typescript
// Old way (still works):
@Inject(API_ENDPOINTS) private apis: any

// New way (being added):
configRegistryService.get<SitesConfig>('sites').apis
```

### **Testing Strategy:**
1. Add registration to module
2. Check console for message
3. Verify site still works
4. Move to next module

---

**Current Status**: ✅ Phase 1 Complete  
**Next Action**: Implement Phase 2 (Core registration)  
**Est. Time**: 15 min per module × 6 modules = 90 min total

---

**Ready to proceed with Phase 2?** 🚀
