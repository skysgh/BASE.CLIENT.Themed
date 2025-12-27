# Tier-Isolated Testing Strategy

**Created:** 2025-12-27  
**Status:** ✅ Active Pattern  
**Priority:** 🔥 **CRITICAL** - Enforces architecture boundaries

---

## 🎯 The Problem We're Solving

**Without Tier Isolation:**
```
core/service.spec.ts imports sites.anon/configuration
                      ↓
Sites tier changes → Core tests break
                      ↓
Can't tell if core is broken or sites is broken!
```

**With Tier Isolation:**
```
core/service.spec.ts ← Only imports from core/
                      ↓
Sites tier changes → Core tests still pass ✅
                      ↓
Core is proven solid, issue must be in sites!
```

---

## 📐 Tier Isolation Rules

### **Tier Hierarchy (Bottom-Up):**

```
┌─────────────────────────────────────┐
│         sites.app (TOP)              │  ← Can import from ALL tiers
├─────────────────────────────────────┤
│         sites.anon                   │  ← Can import: themes, core.ag, core
├─────────────────────────────────────┤
│         themes/t1                    │  ← Can import: core.ag, core
├─────────────────────────────────────┤
│         core.ag                      │  ← Can import: core
├─────────────────────────────────────┤
│         core (FOUNDATION)            │  ← Can ONLY import: Angular, RxJS, npm libs
└─────────────────────────────────────┘
```

---

## 📂 Test File Organization

### **Structure:**

```
src/
├── core/
│   ├── services/
│   │   ├── account.service.ts
│   │   └── account.service.spec.ts        ✅ Tests core in isolation
│   └── testing/
│       └── core-test-helpers.ts           ✅ Core-specific mocks
│
├── core.ag/
│   ├── components/
│   │   ├── header.component.ts
│   │   └── header.component.spec.ts       ✅ Tests core.ag + core
│   └── testing/
│       └── core-ag-test-helpers.ts        ✅ Core.ag-specific mocks
│
├── themes/t1/
│   ├── components/
│   │   ├── logo.component.ts
│   │   └── logo.component.spec.ts         ✅ Tests theme + dependencies
│   └── testing/
│       └── theme-test-helpers.ts          ✅ Theme-specific mocks
│
├── sites.anon/
│   ├── features/
│   │   └── team/
│   │       ├── component.ts
│   │       └── component.spec.ts           ✅ Tests sites.anon + dependencies
│   └── testing/
│       └── sites-anon-test-helpers.ts     ✅ Sites.anon-specific mocks
│
└── testing/
    └── test-helpers.ts                     ⚠️ DEPRECATED (not tier-specific)
```

---

## ✅ Allowed Imports Per Tier

### **Core Tier Tests:**

```typescript
// ✅ ALLOWED:
import { AccountService } from '../services/account.service';           // Same tier
import { AccountConfig } from '../models/account-config.model';         // Same tier
import { setupCoreTestBed } from '../testing/core-test-helpers';       // Same tier
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Angular
import { of } from 'rxjs';                                              // npm lib

// ❌ FORBIDDEN:
import { X } from '../../core.ag/...';         // Higher tier!
import { X } from '../../themes/...';          // Higher tier!
import { X } from '../../sites.anon/...';      // Higher tier!
import { X } from '../../sites.app/...';       // Higher tier!
```

---

### **Core.Ag Tier Tests:**

```typescript
// ✅ ALLOWED:
import { HeaderComponent } from '../components/header.component';       // Same tier
import { setupCoreAgTestBed } from '../testing/core-ag-test-helpers';  // Same tier
import { AccountService } from '../../core/services/account.service';  // Lower tier (OK!)
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Angular

// ❌ FORBIDDEN:
import { X } from '../../themes/...';          // Higher tier!
import { X } from '../../sites.anon/...';      // Higher tier!
import { X } from '../../sites.app/...';       // Higher tier!
```

---

### **Sites.Anon Tier Tests:**

```typescript
// ✅ ALLOWED:
import { TeamComponent } from '../features/team/component';                  // Same tier
import { setupSitesAnonTestBed } from '../testing/sites-anon-test-helpers'; // Same tier
import { AccountService } from '../../core/services/account.service';       // Lower tier (OK!)
import { BaseTranslatePipe } from '../../core.ag/pipes/basetranslate.pipe'; // Lower tier (OK!)
import { HttpClientTestingModule } from '@angular/common/http/testing';      // Angular

// ❌ FORBIDDEN:
import { X } from '../../sites.app/...';       // Higher tier!
```

---

## 🧪 Test Helper Files Per Tier

### **Core Test Helpers** (`core/testing/core-test-helpers.ts`)

**Purpose:** Mocks for testing core services in isolation

**Contents:**
```typescript
✅ setupCoreTestBed()           // Test bed for core tests
✅ mockDefaultAccount            // Core account data
✅ mockFooAccount                // Core account data
✅ mockBarAccount                // Core account data
✅ getMockHttpClient()           // HTTP mock
✅ validateCoreTierIsolation()   // Enforce rules

❌ NO higher-tier mocks here!
```

---

### **Core.Ag Test Helpers** (`core.ag/testing/core-ag-test-helpers.ts`)

**Purpose:** Mocks for testing core.ag components

**Contents:**
```typescript
✅ setupCoreAgTestBed()          // Test bed for core.ag tests
✅ MockAccountService             // Mock core service (dependency)
✅ MockTranslationService         // Mock core.ag service
✅ mockDeployedResources          // DI token mock
✅ mockPublicNavigation           // DI token mock

❌ NO sites.anon or higher mocks here!
```

---

### **Sites.Anon Test Helpers** (`sites.anon/testing/sites-anon-test-helpers.ts`)

**Purpose:** Mocks for testing sites.anon components

**Contents:**
```typescript
✅ setupSitesAnonTestBed()        // Test bed for sites.anon tests
✅ MockAccountService              // Mock core service
✅ MockResourceUrlService          // Mock core service
✅ mockTeamMembers                 // Sites.anon test data
✅ mockPrivateNavigation           // DI token mock

✅ Can mock ANY lower-tier service
```

---

## 📋 Testing Checklist Per Tier

### **When Writing Core Tests:**

- [ ] ✅ Only imports from `core/` directory
- [ ] ✅ Uses `setupCoreTestBed()` from `core/testing/`
- [ ] ✅ Mocks HTTP responses (no real API calls)
- [ ] ✅ Tests service in complete isolation
- [ ] ❌ NO imports from `core.ag/`, `themes/`, `sites.*/`
- [ ] ❌ NO DI tokens from higher tiers

**Rationale:**  
Core is the foundation. If core tests pass, core is solid. Higher tiers can trust core.

---

### **When Writing Core.Ag Tests:**

- [ ] ✅ Can import from `core/` (dependency)
- [ ] ✅ Uses `setupCoreAgTestBed()` from `core.ag/testing/`
- [ ] ✅ Mocks core services (AccountService, etc.)
- [ ] ✅ Tests components with Angular infrastructure
- [ ] ❌ NO imports from `themes/`, `sites.*/`
- [ ] ❌ NO configuration from higher tiers

**Rationale:**  
Core.ag extends core. Tests verify core.ag works when core is working.

---

### **When Writing Sites.Anon Tests:**

- [ ] ✅ Can import from `core/`, `core.ag/`, `themes/`
- [ ] ✅ Uses `setupSitesAnonTestBed()` from `sites.anon/testing/`
- [ ] ✅ Mocks all dependencies (AccountService, ResourceUrlService, etc.)
- [ ] ✅ Tests full component integration
- [ ] ❌ NO imports from `sites.app/` (sibling tier)

**Rationale:**  
Sites.anon is high-level. Tests verify full stack integration (core → theme → sites.anon).

---

## 🎯 Benefits of Tier Isolation

### **1. Pinpoint Failures:**
```
❌ Without Isolation:
"Tests failed" → Which tier is broken? (unknown)

✅ With Isolation:
"Core tests: ✅ Pass"
"Core.Ag tests: ✅ Pass"
"Sites.Anon tests: ❌ Fail"
→ Problem is in sites.anon tier! (known)
```

---

### **2. Reusability:**
```
✅ Core tests = Reusable if core extracted as npm library
✅ Core.ag tests = Reusable if core.ag extracted
❌ Monolithic tests = Locked to specific app structure
```

---

### **3. Refactoring Confidence:**
```
✅ Change sites.anon → Core tests still pass → Core unaffected
✅ Change themes → Core.ag tests still pass → Core.ag unaffected
❌ Without isolation → All tests fail → Can't tell what broke
```

---

### **4. Parallel Development:**
```
✅ Team A: Works on core (tests isolated)
✅ Team B: Works on sites (tests isolated)
✅ No conflicts!

❌ Without isolation: Team A breaks Team B's tests constantly
```

---

## 🚨 Common Violations & Fixes

### **❌ Violation 1: Cross-Tier Import**

**Bad:**
```typescript
// core/services/account.service.spec.ts
import { sitesConfiguration } from '../../sites.anon/configuration';

// ❌ Core test importing from sites tier!
```

**Fix:**
```typescript
// core/services/account.service.spec.ts
import { mockDefaultAccount } from '../testing/core-test-helpers';

// ✅ Core test using core mocks only
```

---

### **❌ Violation 2: Shared Test Helpers**

**Bad:**
```typescript
// testing/test-helpers.ts (root level)
export const mockEverything = { /* all tiers mixed */ };

// ❌ Monolithic test helpers (no tier boundaries)
```

**Fix:**
```typescript
// core/testing/core-test-helpers.ts
export const mockCoreStuff = { /* core only */ };

// core.ag/testing/core-ag-test-helpers.ts
export const mockCoreAgStuff = { /* core.ag only */ };

// ✅ Tier-specific test helpers
```

---

### **❌ Violation 3: Testing Higher-Tier Behavior in Lower Tier**

**Bad:**
```typescript
// core/services/account.service.spec.ts
it('should work with sites.anon navigation', () => {
  // ❌ Core test verifying sites.anon behavior!
});
```

**Fix:**
```typescript
// core/services/account.service.spec.ts
it('should load account configuration', () => {
  // ✅ Core test verifying core behavior only
});

// sites.anon/features/header/component.spec.ts
it('should use account in navigation', () => {
  // ✅ Sites.anon test verifying sites.anon behavior
});
```

---

## 📊 Testing Coverage Per Tier

**Goal:** Each tier has comprehensive coverage of its own logic.

```
Core:          80%+ coverage (foundation must be solid)
Core.Ag:       70%+ coverage (Angular infrastructure)
Themes:        60%+ coverage (UI components)
Sites.Anon:    50%+ coverage (integration tests)
Sites.App:     50%+ coverage (integration tests)
```

**Reasoning:**
- Core = Most critical (everything depends on it)
- Higher tiers = More integration, less unit testing needed

---

## 🎓 Examples

### **Example 1: Core Service Test (Isolated)**

```typescript
// ✅ GOOD: Core test in complete isolation
// File: core/services/account.service.spec.ts

import { AccountService } from './account.service';
import { setupCoreTestBed, mockFooAccount } from '../testing/core-test-helpers';

describe('AccountService', () => {
  let service: AccountService;
  
  beforeEach(() => {
    setupCoreTestBed([], {
      providers: [AccountService]
    });
    service = TestBed.inject(AccountService);
  });

  it('should load foo account', (done) => {
    service.loadAccountBySubdomain('foo').subscribe(account => {
      expect(account).toEqual(mockFooAccount);
      done();
    });
    
    const req = httpMock.expectOne('/assets/data/accounts/foo.json');
    req.flush(mockFooAccount);
  });
});

// ✅ No higher-tier imports
// ✅ Tests core logic only
// ✅ Isolated and reusable
```

---

### **Example 2: Sites.Anon Component Test (Integration)**

```typescript
// ✅ GOOD: Sites.anon test with mocked dependencies
// File: sites.anon/features/team/component.spec.ts

import { TeamComponent } from './component';
import { setupSitesAnonTestBed, MockAccountService, MockResourceUrlService } from '../../testing/sites-anon-test-helpers';

describe('TeamComponent', () => {
  let mockAccountService: MockAccountService;
  let mockResourceUrlService: MockResourceUrlService;
  
  beforeEach(() => {
    mockAccountService = new MockAccountService();
    mockResourceUrlService = new MockResourceUrlService();
    
    setupSitesAnonTestBed([TeamComponent], {
      providers: [
        { provide: AccountService, useValue: mockAccountService },
        { provide: ResourceUrlService, useValue: mockResourceUrlService }
      ]
    });
  });

  it('should display team members', () => {
    // Test integration of all tiers
  });
});

// ✅ Imports from lower tiers (core, core.ag)
// ✅ Mocks dependencies
// ✅ Tests full integration
```

---

## 🔄 Migration Path

**Current State:**
```
❌ Monolithic test-helpers.ts (all tiers mixed)
❌ Tests import across tier boundaries
❌ Hard to tell which tier has issues
```

**Target State:**
```
✅ Tier-specific test helpers
✅ Tests isolated per tier
✅ Clear failure attribution
```

**Steps:**
1. ✅ Create `core/testing/core-test-helpers.ts` (DONE)
2. ✅ Create `core/services/account.service.spec.ts` (DONE)
3. ⏳ Create `core.ag/testing/core-ag-test-helpers.ts` (TODO)
4. ⏳ Create `sites.anon/testing/sites-anon-test-helpers.ts` (TODO)
5. ⏳ Migrate existing tests to use tier-specific helpers (TODO)
6. ⏳ Delete monolithic `testing/test-helpers.ts` (TODO)

---

## 📝 Summary

**Golden Rules:**
1. **Core tests = Core imports only** (rock-solid foundation)
2. **Higher tier tests = Can import lower tiers** (integration)
3. **Test helpers = Tier-specific** (clear boundaries)
4. **Failures = Pinpoint exact tier** (fast debugging)

**Result:**
- ✅ Scalable testing strategy
- ✅ Clear architecture boundaries
- ✅ Reusable test code
- ✅ Fast failure attribution
- ✅ Confident refactoring

---

**Status:** 🎯 **Active Pattern - Use for All Tests**  
**Next:** Create tier-specific test helpers for core.ag and sites.anon  
**Review:** After Phase 1 complete (all core services tested)
