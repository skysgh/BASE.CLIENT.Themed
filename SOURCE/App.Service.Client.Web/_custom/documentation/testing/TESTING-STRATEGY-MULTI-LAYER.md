# Testing Strategy - Multi-Layer Approach

**Created:** 2025-12-27  
**Status:** 📋 Strategy Document  
**Current:** ❌ Tests Broken  
**Goal:** ✅ Restore & Enhance Testing

---

## 🎯 Executive Summary

**You're Right:** Tests have been broken for a while (Jasmine/Karma based)

**Your Vision:** Two-layer testing approach
1. **Layer 1:** Static/Logic tests (during build)
2. **Layer 2:** Dynamic/Integration tests (BT environment)

**Effort to Restore:** Medium (2-4 days initial, then incremental)

---

## 📊 Current State Assessment

### **What Exists:**

| Component | Status | Location |
|-----------|--------|----------|
| Karma config | ✅ Present | `karma.conf.js` |
| Jasmine framework | ✅ Installed | `package.json` |
| Test runner | ✅ Configured | `angular.json` |
| Spec files | ⚠️ Broken | `**/*.spec.ts` (scattered) |
| Test command | ✅ Exists | `npm run test` |

### **What's Broken:**

```typescript
// Typical broken test (auth/success-msg/basic/component.spec.ts):
describe('BasicComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();  // ❌ Fails due to missing deps
  });
});
```

**Why They Break:**
- ❌ Missing service mocks (AccountService, ConfigRegistryService, etc.)
- ❌ Missing DI token providers (DEPLOYED_RESOURCES, PRIVATE_NAVIGATION)
- ❌ Circular dependencies in test setup
- ❌ Cross-tier imports not properly mocked

---

## 🏗️ Recommended Two-Layer Architecture

### **Layer 1: Fast Feedback Loop** (Build-Time)

```
┌─────────────────────────────────────────────────────┐
│          npm run build (Development)                 │
├─────────────────────────────────────────────────────┤
│ 1. TypeScript Compilation                           │
│    ✅ Type checking                                  │
│    ✅ Interface contracts                            │
│    ✅ Syntax errors                                  │
│                                                      │
│ 2. Linting (ESLint/TSLint)                         │
│    ✅ Code style violations                          │
│    ✅ Unused imports                                 │
│    ✅ Complexity warnings                            │
│                                                      │
│ 3. Unit Tests (Jasmine/Karma - Fast)               │
│    ✅ Service logic tests                            │
│    ✅ Pipe transformation tests                      │
│    ✅ Model validation tests                         │
│    ⚠️ Component tests (shallow only)                │
│                                                      │
│ Speed: ~30 seconds                                   │
│ When: Every save (watch mode) or commit             │
└─────────────────────────────────────────────────────┘
```

### **Layer 2: Comprehensive Validation** (CI/CD Pipeline)

```
┌─────────────────────────────────────────────────────┐
│       CI/CD Pipeline (Build Test Environment)        │
├─────────────────────────────────────────────────────┤
│ 1. Layer 1 Tests (repeated)                        │
│    ✅ All static tests from Layer 1                  │
│                                                      │
│ 2. Integration Tests (Cypress/Playwright)           │
│    ✅ Component integration                          │
│    ✅ Service interactions                           │
│    ✅ Router navigation                              │
│    ✅ API mocking (json-server)                      │
│                                                      │
│ 3. E2E Tests (Cypress/Playwright)                  │
│    ✅ User workflows                                 │
│    ✅ Multi-page journeys                            │
│    ✅ Form submissions                               │
│    ✅ Auth flows                                     │
│                                                      │
│ 4. Visual Regression (Percy/Chromatic)             │
│    ✅ Screenshot comparisons                         │
│    ✅ CSS/styling changes                            │
│    ✅ Responsive layouts                             │
│                                                      │
│ Speed: ~5-10 minutes                                │
│ When: PR merge, nightly builds                      │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Phased Implementation Plan

### **Phase 1: Restore Basic Testing** (Week 1)

**Goal:** Get `npm run test` working again

**Tasks:**

1. **Fix Test Infrastructure** (Day 1)
```sh
# Update dependencies
npm install --save-dev @angular/core@17 @angular/platform-browser-dynamic@17
npm install --save-dev karma@latest karma-jasmine@latest karma-chrome-launcher@latest

# Verify karma config
ng test --dry-run
```

2. **Create Test Utilities** (Day 1-2)

**File:** `src/testing/test-helpers.ts`
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Common test bed configuration
 * Use in every component test
 */
export function setupTestBed(declarations: any[] = []) {
  return TestBed.configureTestingModule({
    declarations,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      TranslateModule.forRoot()
    ],
    providers: [
      // Mock common services
      { provide: AccountService, useClass: MockAccountService },
      { provide: ConfigRegistryService, useClass: MockConfigRegistryService },
      // Mock DI tokens
      { provide: DEPLOYED_RESOURCES, useValue: mockDeployedResources },
      { provide: PRIVATE_NAVIGATION, useValue: mockPrivateNavigation }
    ]
  });
}

// Mock services
export class MockAccountService {
  getConfigValue(path: string) {
    return of('mock-value');
  }
}

export class MockConfigRegistryService {
  get(key: string) {
    return { /* mock config */ };
  }
}

// Mock token values
export const mockDeployedResources = {
  logos: { light: '/mock/logo.png', dark: '/mock/logo-dark.png' },
  images: { root: '/mock/', trustedBy: '/mock/', flags: '/mock/', backgrounds: '/mock/' },
  files: { root: '/mock/', markdown: '/mock/', pdf: '/mock/' }
};

export const mockPrivateNavigation = {
  dashboards: { root: '/dashboards' },
  // ...etc
};
```

3. **Fix One Component Test** (Day 2)

**Example:** `team/component.spec.ts`
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TeamComponent } from './component';
import { setupTestBed } from '../../../../../../testing/test-helpers';
import { ResourceUrlService } from '../../../../../../../core/services/resource-url.service';

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;
  let mockResourceUrlService: jasmine.SpyObj<ResourceUrlService>;

  beforeEach(async () => {
    // Create spy
    mockResourceUrlService = jasmine.createSpyObj('ResourceUrlService', ['getTeamMemberPhotoUrl']);
    mockResourceUrlService.getTeamMemberPhotoUrl.and.returnValue(of('/mock/avatar.jpg'));

    await setupTestBed([TeamComponent]).compileComponents();
    
    TestBed.overrideProvider(ResourceUrlService, { useValue: mockResourceUrlService });
    
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get team member photo URL', (done) => {
    component.getUserPhotoUrl('avatar-2.jpg').subscribe(url => {
      expect(url).toBe('/mock/avatar.jpg');
      expect(mockResourceUrlService.getTeamMemberPhotoUrl).toHaveBeenCalledWith('avatar-2.jpg');
      done();
    });
  });
});
```

4. **Run Tests** (Day 2)
```sh
npm run test

# Should see:
# ✅ 1 test passed
# ⚠️ X tests failed (old broken tests - ignore for now)
```

---

### **Phase 2: Core Service Tests** (Week 2)

**Goal:** Test critical services (no UI)

**Priority Services:**
1. `AccountService` ✅ (multi-account logic)
2. `ResourceUrlService` ✅ (new service)
3. `TranslationService` (i18n logic)
4. `ConfigRegistryService` (config management)

**Example:** `resource-url.service.spec.ts`
```typescript
describe('ResourceUrlService', () => {
  let service: ResourceUrlService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResourceUrlService]
    });
    
    service = TestBed.inject(ResourceUrlService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Development Mode', () => {
    it('should return theme path for team member photo', (done) => {
      service.getTeamMemberPhotoUrl('avatar-2.jpg').subscribe(url => {
        expect(url).toBe('/assets/deployed/images/users/avatar-2.jpg');
        done();
      });
    });

    it('should return theme path for user avatar', (done) => {
      service.getUserAvatarUrl('avatar-5.jpg').subscribe(url => {
        expect(url).toBe('/assets/deployed/images/users/avatar-5.jpg');
        done();
      });
    });
  });

  describe('Production Mode', () => {
    beforeEach(() => {
      // Mock environment.production = true
      spyOnProperty(environment, 'production').and.returnValue(true);
    });

    it('should call API for signed URL', () => {
      service.getTeamMemberPhotoUrl('avatar-2.jpg').subscribe();

      const req = httpMock.expectOne('/api/resources/sign');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.path).toBe('public/team/avatar-2.jpg');
      
      req.flush({ url: 'https://cdn.example.com/signed-url' });
    });
  });
});
```

---

### **Phase 3: Component Integration** (Week 3)

**Goal:** Deep component tests with real templates

**Approach:** Shallow vs Deep testing

**Shallow (Fast):**
```typescript
// Mock child components
@Component({ selector: 'child-component', template: '' })
class MockChildComponent {}

TestBed.configureTestingModule({
  declarations: [ParentComponent, MockChildComponent],
  schemas: [NO_ERRORS_SCHEMA]  // Ignore unknown elements
});
```

**Deep (Comprehensive):**
```typescript
// Include real child components
TestBed.configureTestingModule({
  declarations: [ParentComponent, ChildComponent, GrandchildComponent],
  imports: [SharedModule]
});

// Test interactions
const button = fixture.debugElement.query(By.css('button'));
button.nativeElement.click();
expect(component.childData).toBe('expected value');
```

---

### **Phase 4: E2E Tests** (Week 4)

**Goal:** User journey testing

**Tool:** Cypress (modern, better than Protractor)

**Install:**
```sh
npm install --save-dev cypress @cypress/angular
npx cypress open
```

**Example:** `cypress/e2e/team-page.cy.ts`
```typescript
describe('Team Page', () => {
  beforeEach(() => {
    cy.visit('/pages');
  });

  it('should display team members', () => {
    cy.get('[data-testid="team-section"]').should('be.visible');
    cy.get('.avatar-xl img').should('have.length', 8);
    
    // Check first team member
    cy.get('.avatar-xl img').first()
      .should('have.attr', 'src')
      .and('include', 'avatar-2.jpg');
  });

  it('should navigate to team page on View All click', () => {
    cy.contains('View All Memberships').click();
    cy.url().should('include', '/teams');
  });

  it('should load avatars successfully', () => {
    cy.get('.avatar-xl img').each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and(($el) => {
          expect($el[0].naturalWidth).to.be.greaterThan(0);
        });
    });
  });
});
```

---

## 📋 Implementation Checklist

### **Week 1: Infrastructure** ✅
- [ ] Update test dependencies
- [ ] Create `testing/test-helpers.ts`
- [ ] Fix one component test (proof of concept)
- [ ] Document testing patterns

### **Week 2: Core Services** ⏳
- [ ] AccountService tests (high priority!)
- [ ] ResourceUrlService tests
- [ ] TranslationService tests
- [ ] ConfigRegistryService tests

### **Week 3: Components** ⏳
- [ ] Team component tests
- [ ] Header component tests
- [ ] Footer component tests
- [ ] Auth components tests

### **Week 4: E2E** ⏳
- [ ] Install Cypress
- [ ] Configure Cypress for Angular
- [ ] Write critical path tests (login, navigation)
- [ ] Add to CI/CD pipeline

---

## 🔧 NPM Scripts Update

**Add to `package.json`:**
```json
{
  "scripts": {
    "test": "ng test",
    "test:watch": "ng test --watch",
    "test:coverage": "ng test --code-coverage",
    "test:ci": "ng test --browsers=ChromeHeadless --watch=false --code-coverage",
    "e2e": "cypress open",
    "e2e:ci": "cypress run --browser chrome",
    "lint": "ng lint",
    "build:test": "npm run lint && npm run test:ci && ng build"
  }
}
```

---

## 🎯 Effort Estimation

### **Initial Setup (Phase 1):**
- **Effort:** 2-3 days
- **Value:** Tests run again ✅
- **ROI:** High (catches regressions immediately)

### **Service Tests (Phase 2):**
- **Effort:** 3-4 days
- **Value:** Core logic protected ✅
- **ROI:** Very High (services are reused everywhere)

### **Component Tests (Phase 3):**
- **Effort:** 1-2 weeks (incremental)
- **Value:** UI logic protected ✅
- **ROI:** Medium (more work, but catches UI bugs)

### **E2E Tests (Phase 4):**
- **Effort:** 1 week
- **Value:** User journeys protected ✅
- **ROI:** High (catches integration issues)

---

## 🚦 CI/CD Integration

### **GitHub Actions Example:**

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Unit Tests
        run: npm run test:ci
        
      - name: Build
        run: npm run build
        
      - name: E2E Tests
        run: npm run e2e:ci
        
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 📊 Success Metrics

### **After Phase 1:**
```
✅ npm run test executes without errors
✅ 1+ component test passing
✅ Test helpers in place
✅ Pattern documented
```

### **After Phase 2:**
```
✅ 4 core services tested (>80% coverage)
✅ Critical business logic protected
✅ Fast feedback (<30s)
```

### **After Phase 3:**
```
✅ 10+ component tests passing
✅ UI interactions verified
✅ Template rendering tested
```

### **After Phase 4:**
```
✅ 5+ E2E scenarios passing
✅ Critical user journeys protected
✅ CI/CD pipeline runs all tests
```

---

## 🎓 Best Practices

### **DO:**
- ✅ Test behavior, not implementation
- ✅ Use mocks for external dependencies
- ✅ Keep tests fast (unit tests <1s each)
- ✅ Write tests for new features (test-first!)
- ✅ Use descriptive test names

### **DON'T:**
- ❌ Test private methods (test public API only)
- ❌ Test framework code (Angular is tested)
- ❌ Over-mock (use real objects when fast)
- ❌ Write brittle tests (avoid implementation details)
- ❌ Skip tests because "it's too hard" (refactor code instead!)

---

## 📚 Resources

- **Jasmine Docs:** https://jasmine.github.io/
- **Karma Docs:** https://karma-runner.github.io/
- **Angular Testing:** https://angular.io/guide/testing
- **Cypress Docs:** https://docs.cypress.io/
- **Testing Library:** https://testing-library.com/angular

---

## 🎯 Bottom Line

**Your Question:** "What effort to restore testing?"

**Answer:** 
- **Phase 1 (Critical):** 2-3 days → Get tests running
- **Phase 2 (High Value):** 3-4 days → Test core services
- **Phase 3 (Medium Value):** 1-2 weeks → Test components
- **Phase 4 (Integration):** 1 week → E2E tests

**Total:** 3-4 weeks for complete coverage (but incremental value from Day 3!)

**Recommendation:** Start with Phase 1 next week. Small investment, huge ROI.

---

**Status:** 📋 Strategy Complete - Ready for Implementation  
**Next Step:** Decide when to start Phase 1  
**Review Date:** After Phase 1 completion

---

**Document Version:** 1.0  
**Created:** 2025-12-27  
**Status:** Active Strategy - Awaiting Go-Ahead
