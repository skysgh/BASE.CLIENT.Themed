# ROOT_RELATIVE_PATH Pattern Implementation Guide

**Date**: 2025-01-24  
**Purpose**: Separate human-readable names from machine file paths  
**Status**: Implementation in progress

---

## 🎯 **Problem Being Solved**

### **Current Pattern (Scattered toLowerCase):**
```typescript
// core/constants/t.core.constants.ts
export const NAME = 'Core';

// Later in code:
const path = `${NAME.toLowerCase()}/assets`;     // ❌ Scattered
const url = `assets/${NAME.toLowerCase()}/...`;  // ❌ Repeated
const route = NAME.toLowerCase();                 // ❌ Everywhere
```

**Issues:**
- ❌ `.toLowerCase()` scattered throughout codebase
- ❌ Assumption that path = name.toLowerCase()
- ❌ Can't have path different from name
- ❌ Hard to refactor (change name = change paths?)

---

## ✅ **Solution: ROOT_RELATIVE_PATH Constant**

### **New Pattern:**
```typescript
// core/constants/t.core.constants.ts
export const NAME = 'Core';                    // Human-readable
export const ROOT_RELATIVE_PATH = 'core';      // Machine path (pre-lowercased)

// Later in code:
const path = `${ROOT_RELATIVE_PATH}/assets`;   // ✅ Clean
const url = `assets/${ROOT_RELATIVE_PATH}/...`;// ✅ Explicit
const route = ROOT_RELATIVE_PATH;              // ✅ Clear
```

**Benefits:**
- ✅ Path is explicit and pre-computed
- ✅ No scattered `.toLowerCase()`
- ✅ Path can differ from name if needed
- ✅ Easy to refactor (change path in one place)
- ✅ Self-documenting

---

## 📂 **Implementation by Module**

### **Pattern to Follow:**

```typescript
// Module constants type definition
export type TModuleConstants = TBaseConstants & {
  // ... existing properties
}

// Module constants implementation
export const NAME = 'Module.Name';              // Display name
export const ROOT_RELATIVE_PATH = 'module';     // File system path
export const PATHFRAGMENT = ROOT_RELATIVE_PATH; // Alias (for backward compat)

export const moduleConstants: TModuleConstants = {
  id: NAME,
  // Use ROOT_RELATIVE_PATH for all path construction
  assets: {
    root: `assets/${ROOT_RELATIVE_PATH}/`
  },
  // ...
}
```

---

## 🗂️ **Modules to Update**

### **1. Bootstrap Tier** (apps.bootstrap)

**File**: `apps.bootstrap/constants/apps.main.constants.name.ts`

```typescript
export const NAME = 'Apps.Main';                        // Display
export const ROOT_RELATIVE_PATH = 'apps.bootstrap';     // Path (renamed!)
export const PATHFRAGMENT = ROOT_RELATIVE_PATH;
```

**Usage in**: `apps.bootstrap/constants/implementations/apps.main.constants.*.ts`

---

### **2. Private Tier** (apps)

**File**: `apps/constants/apps.constants.name.ts`

```typescript
export const NAME = 'Apps';                      // Display
export const ROOT_RELATIVE_PATH = 'apps';        // Path
export const PATHFRAGMENT = ROOT_RELATIVE_PATH;
```

---

### **3. Applets Tier** (app.lets)

**File**: `app.lets/constants/implementations/app.lets.constants.ts`

```typescript
const NAME = 'Applets';                          // Display
export const ROOT_RELATIVE_PATH = 'app.lets';    // Path
export const PATHFRAGMENT = ROOT_RELATIVE_PATH;

export const appletsConstants: TAppletsConstants = {
  id: NAME,
  // Use ROOT_RELATIVE_PATH in asset paths
  assets: {
    root: `assets/${ROOT_RELATIVE_PATH}/`
  }
}
```

---

### **4. Sites Tier** (sites)

**File**: `sites/constants/sites.constants.name.ts`

```typescript
export const NAME = 'Sites';                     // Display
export const ROOT_RELATIVE_PATH = 'sites';       // Path
export const PATHFRAGMENT = ROOT_RELATIVE_PATH;
```

---

### **5. Core Tier** (core)

**File**: `core/constants/t.core.constants.ts`

```typescript
export const NAME = 'Core';                      // Display
export const ROOT_RELATIVE_PATH = 'core';        // Path
```

---

### **6. Core.Ag Tier** (core.ag)

**File**: `core.ag/constants/t.coreAg.constants.ts`

```typescript
export const NAME = 'Core.Ag';                   // Display
export const ROOT_RELATIVE_PATH = 'core.ag';     // Path
```

---

### **7. Themes Tier** (themes)

**File**: `themes/t1/constants/t.themes.t1.constants.ts`

```typescript
export const NAME = 'Themes.T1';                     // Display
export const ROOT_RELATIVE_PATH = 'themes/t1';       // Path (nested!)
```

---

## 🔄 **Migration Steps**

### **For Each Module:**

**Step 1: Add ROOT_RELATIVE_PATH constant**
```typescript
// In module constants file
export const ROOT_RELATIVE_PATH = 'module-path';
```

**Step 2: Update path construction**
```typescript
// Before:
const path = `${NAME.toLowerCase()}/assets`;

// After:
const path = `${ROOT_RELATIVE_PATH}/assets`;
```

**Step 3: Update asset/resource configuration**
```typescript
// Before:
assets: {
  root: `assets/${NAME.toLowerCase()}/`
}

// After:
assets: {
  root: `assets/${ROOT_RELATIVE_PATH}/`
}
```

**Step 4: Search and replace `.toLowerCase()` calls**
```powershell
# In module directory
Get-ChildItem -Recurse -Include *.ts | 
  Select-String "NAME\.toLowerCase\(\)" |
  # Review and update each occurrence
```

---

## 🎨 **Examples**

### **Example 1: Simple Module (Core)**

**Before:**
```typescript
// core/constants/implementations/core.constants.resources.ts
import { NAME } from '../t.core.constants';

export const RESOURCES_OPEN = 
  StringService.replaceTemplate(
    environment.custom.urls.media.open, 
    NAME  // ← Relies on StringService to lowercase
  ).toLowerCase();  // ← Extra toLowerCase for safety
```

**After:**
```typescript
// core/constants/implementations/core.constants.resources.ts
import { ROOT_RELATIVE_PATH } from '../t.core.constants';

export const RESOURCES_OPEN = 
  StringService.replaceTemplate(
    environment.custom.urls.media.open, 
    ROOT_RELATIVE_PATH  // ✅ Already lowercase
  );  // ✅ No extra toLowerCase needed
```

---

### **Example 2: Nested Module (Themes)**

**Before:**
```typescript
// themes/t1/constants/implementations/themes.t1.constants.assets.ts
const NAME = 'Themes';

export const themesT1ConstantsAssets = {
  deployed: `assets/${NAME.toLowerCase()}/t1/deployed/`  // ❌ Scattered
}
```

**After:**
```typescript
// themes/t1/constants/implementations/themes.t1.constants.assets.ts
const ROOT_RELATIVE_PATH = 'themes/t1';  // ✅ Full nested path

export const themesT1ConstantsAssets = {
  deployed: `assets/${ROOT_RELATIVE_PATH}/deployed/`  // ✅ Clean
}
```

---

### **Example 3: Dynamic Construction (Apps.Bootstrap)**

**Before:**
```typescript
// apps.bootstrap/constants/implementations/apps.main.constants.resources.ts
const NAME = 'Apps.Main';
const OPEN_DYNAMIC = StringService.replaceTemplate(
  environment.custom.urls.media.open, 
  PATHFRAGMENT  // Where PATHFRAGMENT was NAME.toLowerCase()
);
```

**After:**
```typescript
// apps.bootstrap/constants/implementations/apps.main.constants.resources.ts
const ROOT_RELATIVE_PATH = 'apps.bootstrap';  // ✅ Explicit
const OPEN_DYNAMIC = StringService.replaceTemplate(
  environment.custom.urls.media.open, 
  ROOT_RELATIVE_PATH  // ✅ No toLowerCase needed
);
```

---

## ✅ **Verification Checklist**

After implementing ROOT_RELATIVE_PATH:

- [ ] All modules have ROOT_RELATIVE_PATH defined
- [ ] All `.toLowerCase()` calls on NAME removed
- [ ] Asset paths use ROOT_RELATIVE_PATH
- [ ] Resource paths use ROOT_RELATIVE_PATH
- [ ] Routing paths use ROOT_RELATIVE_PATH (if applicable)
- [ ] Build successful (no broken paths)
- [ ] Assets load correctly (check DevTools network tab)

---

## 🎯 **Quick Reference**

| Module | NAME | ROOT_RELATIVE_PATH |
|--------|------|-------------------|
| Bootstrap | 'Apps.Main' | 'apps.bootstrap' |
| Apps | 'Apps' | 'apps' |
| Applets | 'Applets' | 'app.lets' |
| Sites | 'Sites' | 'sites' |
| Core | 'Core' | 'core' |
| Core.Ag | 'Core.Ag' | 'core.ag' |
| Themes.T1 | 'Themes.T1' | 'themes/t1' |

---

## 🚀 **Next Steps**

1. ✅ Define ROOT_RELATIVE_PATH in each module
2. ✅ Update path construction code
3. ✅ Remove `.toLowerCase()` calls
4. ✅ Test asset loading
5. ✅ Commit with clear message

**Status**: Pattern established, ready for implementation  
**Priority**: High (eliminates scattered toLowerCase anti-pattern)  
**Risk**: Low (purely internal refactoring)

---

**Document Version**: 1.0  
**Author**: Architecture Team  
**Next Review**: After implementation complete
