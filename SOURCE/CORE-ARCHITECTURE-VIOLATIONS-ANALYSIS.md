# Core Architecture Violations Analysis

**Date:** 2024-12-28  
**Issue:** Core module contains Angular-specific code, violating framework-agnostic principle

---

## ?? CORE ARCHITECTURE PRINCIPLE

**Core should be:** Framework-agnostic, pure TypeScript/JavaScript
**Reality:** Core currently contains Angular-specific dependencies

---

## ? VIOLATIONS FOUND IN CORE/

### 1. **Guards** (Angular-specific)
```
core/guards/
??? auth.guard.ts        ? Uses @angular/router, @angular/core
??? account.guard.ts     ? Uses @angular/router, @angular/core
??? *.spec.ts           ? Angular testing dependencies
```

**Why violation:** Guards are Angular Router concepts (CanActivate, CanLoad)
**Should be:** In `core.ag/guards/` (Angular-specific tier)

---

### 2. **Repositories** (RxJS + Angular)
```
core/repositories/
??? base/repository.service.ts           ? Uses @angular/common/http, RxJS
??? service-*.repository.ts              ? All use HttpClient, @Injectable
??? *.spec.ts                           ? Angular testing
```

**Why violation:** 
- Uses `@angular/common/http` (HttpClient)
- Uses `@Injectable()` decorator
- Uses RxJS Observables

**Should be:** In `core.ag/repositories/` (Angular HTTP tier)

---

### 3. **Services** (Angular + RxJS)
```
core/services/
??? *.service.ts        ? All use @Injectable, many use HttpClient
??? signal-based       ? Uses Angular Signals (@angular/core)
??? *.spec.ts         ? Angular testing
```

**Why violation:**
- Uses `@Injectable()` decorator
- Uses Angular Signals (signal, computed)
- Uses RxJS Observables
- Uses HttpClient for some services

**Should be:** In `core.ag/services/` (Angular-specific implementations)

---

### 4. **Mappers** (Mostly OK, but...)
```
core/mappers/
??? *.mapper.ts         ??  Pure functions (GOOD!)
??? *.spec.ts          ? Angular testing dependencies
```

**Status:** Mappers themselves are pure functions (? OK in core)  
**Issue:** Test files use Angular testing framework

**Decision:** Keep mappers in core/, move tests to core.ag/

---

### 5. **DTOs** (? CORRECT LOCATION)
```
core/models/dtos/
??? *.dto.ts           ? Pure TypeScript interfaces
```

**Status:** DTOs are pure TypeScript interfaces - **CORRECT location!**

---

### 6. **ViewModels** (?? QUESTIONABLE)
```
core/models/view-models/
??? *.view-model.ts    ??  UI-specific, but pure TypeScript
```

**Debate:** 
- **Pro keeping in core:** They're pure TypeScript interfaces
- **Con:** They're UI-specific (not domain logic)

**Recommendation:** **KEEP in core/** because:
- They're pure TypeScript (no framework dependencies)
- They're used by mappers (which are in core)
- They define the contract between layers

---

## ? WHAT SHOULD STAY IN CORE/

### **Pure TypeScript Only:**
1. ? **DTOs** - Pure interfaces matching API
2. ? **ViewModels** - Pure interfaces for UI  
3. ? **Mappers** - Pure functions (DTO ? ViewModel)
4. ? **Domain Models** - Pure business logic classes
5. ? **Constants** - Pure TypeScript constants
6. ? **Utilities** - Pure TypeScript helper functions

---

## ?? WHAT SHOULD MOVE TO CORE.AG/

### **Angular-Specific Code:**
1. ? **Guards** ? `core.ag/guards/`
2. ? **Repositories** ? `core.ag/repositories/`
3. ? **Services** ? `core.ag/services/`
4. ? **Interceptors** ? Already in `core.ag/interceptors/` ?
5. ? **Pipes** ? `core.ag/pipes/` (if any)
6. ? **Directives** ? `core.ag/directives/` (if any)
7. ? **Test files** ? `core.ag/testing/`

---

## ?? PROPOSED RESTRUCTURING

### **Phase 1: Move Guards**
```
FROM: core/guards/auth.guard.ts
TO:   core.ag/guards/auth.guard.ts
```

### **Phase 2: Move Repositories**
```
FROM: core/repositories/
TO:   core.ag/repositories/
```

### **Phase 3: Move Services**
```
FROM: core/services/
TO:   core.ag/services/
```

### **Phase 4: Update Imports**
- Update all imports across workspace
- Verify build passes
- Update documentation

---

## ?? BENEFITS OF RESTRUCTURING

### **Clear Boundaries:**
- `core/` = Pure TypeScript (framework-agnostic)
- `core.ag/` = Angular-specific implementations
- Easy to understand what depends on Angular

### **Future-Proofing:**
- Could port to React/Vue by replacing `core.ag/`
- Core business logic remains untouched
- DTOs and ViewModels are reusable

### **Testing:**
- Core logic testable without Angular dependencies
- Faster unit tests (no Angular TestBed)
- Clear separation of concerns

---

## ?? CHALLENGES

### **Massive Refactoring:**
- 100+ files to move
- 500+ import statements to update
- Risk of breaking existing code

### **Import Path Changes:**
```typescript
// OLD:
import { AuthGuard } from '../../core/guards/auth.guard';
import { ServiceRepository } from '../../core/repositories/service.repository';

// NEW:
import { AuthGuard } from '../../core.ag/guards/auth.guard';
import { ServiceRepository } from '../../core.ag/repositories/service.repository';
```

---

## ?? RECOMMENDATION

### **Do This AFTER Phase 2B Stabilizes:**
1. Complete Phase 2B (Signal migration) ?
2. Let architecture settle for a few days
3. Then tackle core ? core.ag migration (Phase 2C)

### **OR: Accept Current State**
- Document that `core/` includes Angular dependencies
- Rename to `core.angular/` to be explicit
- Focus on delivering features instead

---

## ?? IMPACT ANALYSIS

**Files to Move:** ~150
**Import Statements to Update:** ~500
**Risk Level:** HIGH
**Benefit:** Clear architecture boundaries
**Time Estimate:** 2-3 days

---

**Decision:** Defer to Phase 2C after Phase 2B stabilizes  
**Alternative:** Accept current architecture with clear documentation
