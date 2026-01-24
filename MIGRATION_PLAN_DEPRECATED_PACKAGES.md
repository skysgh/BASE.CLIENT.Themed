# Migration Plan: Remove Deprecated NPM Packages

**Status:** Draft  
**Created:** 2025-01-24  
**Target Completion:** TBD

## ?? Overview

This document outlines the step-by-step plan to migrate away from deprecated NPM packages that are currently in use but no longer supported.

---

## ?? Packages to Migrate

### 1. `@nicky-lenaers/ngx-scroll-to` (^14.0.0)
- **Status:** No longer supported
- **Current Usage:** Landing page header navigation
- **Files Affected:**
  - `src/sites.anon/features/pages/landing/_sharedparts/ui/viewsections/header/component.ts`
  - `src/sites.anon/features/pages/landing/_sharedparts/module.ts`

### 2. `ngx-slider-v2` (^17.0.0)
- **Status:** Deprecated (merged into main repo)
- **Replacement:** `@angular-slider/ngx-slider` (^18.0.0)
- **Current Usage:** Forms module (range sliders)
- **Files Affected:**
  - `src/themes/t1.dev/reference/forms/module.ts`
  - `src/themes/t1.dev/reference/forms/range-sliders/range-sliders.component.ts`

### 3. `intersection-observer` (^0.12.2)
- **Status:** No longer needed (baseline since 2019)
- **Current Usage:** Polyfills
- **Files Affected:**
  - `src/polyfills.ts`

---

## ?? Migration Strategy

### Phase 1: Preparation & Analysis
**Duration:** 1-2 days

#### Step 1.1: Document All Usages
- [x] Identify all files importing deprecated packages
- [ ] Document current functionality for each usage
- [ ] Create test cases for affected features
- [ ] Screenshot/record current behavior for reference

#### Step 1.2: Research Replacements
- [ ] Research scroll-to alternatives:
  - Option A: Use native `window.scrollTo()` with smooth behavior
  - Option B: Use Angular's `ViewportScroller`
  - Option C: Custom scroll service
- [ ] Verify `@angular-slider/ngx-slider` compatibility with Angular 21
- [ ] Confirm intersection-observer removal is safe for target browsers

#### Step 1.3: Set Up Testing Environment
- [ ] Create a feature branch: `refactor/remove-deprecated-packages`
- [ ] Ensure all existing tests pass
- [ ] Document baseline test results

---

### Phase 2: Replace `ngx-slider-v2`
**Duration:** 1 day  
**Risk Level:** LOW (replacement exists)

#### Step 2.1: Install Replacement
```bash
npm install @angular-slider/ngx-slider@^18.0.0
```

#### Step 2.2: Update Imports
**File:** `src/themes/t1.dev/reference/forms/module.ts`
```typescript
// OLD:
import { NgxSliderModule } from 'ngx-slider-v2';

// NEW:
import { NgxSliderModule } from '@angular-slider/ngx-slider';
```

**File:** `src/themes/t1.dev/reference/forms/range-sliders/range-sliders.component.ts`
```typescript
// OLD:
import { Options } from 'ngx-slider-v2';

// NEW:
import { Options } from '@angular-slider/ngx-slider';
```

#### Step 2.3: Update Styles (if needed)
- [ ] Check if style imports need updating
- [ ] Verify slider appearance in browser
- [ ] Test all slider interactions

#### Step 2.4: Remove Old Package
```bash
npm uninstall ngx-slider-v2
```

#### Step 2.5: Test & Verify
- [ ] Manual testing of all range slider components
- [ ] Verify no console errors
- [ ] Check responsive behavior
- [ ] Test in all supported browsers

#### Step 2.6: Commit
```bash
git add .
git commit -m "refactor: Replace ngx-slider-v2 with @angular-slider/ngx-slider"
```

---

### Phase 3: Replace `@nicky-lenaers/ngx-scroll-to`
**Duration:** 2-3 days  
**Risk Level:** MEDIUM (requires custom implementation)

#### Step 3.1: Create Custom Scroll Service
**File:** `src/core/services/scroll.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private viewportScroller: ViewportScroller) {}

  /**
   * Scroll to element by ID with smooth behavior
   */
  scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Scroll to top of page
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Scroll to specific position
   */
  scrollTo(position: number): void {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }
}
```

#### Step 3.2: Update Landing Page Header Component
**File:** `src/sites.anon/features/pages/landing/_sharedparts/ui/viewsections/header/component.ts`

```typescript
// OLD:
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

// NEW:
import { ScrollService } from 'src/core/services/scroll.service';

// In constructor:
// OLD:
constructor(private scrollToService: ScrollToService) {}

// NEW:
constructor(private scrollService: ScrollService) {}

// In methods:
// OLD:
this.scrollToService.scrollTo({ target: 'section-id' });

// NEW:
this.scrollService.scrollToElement('section-id');
```

#### Step 3.3: Update Module Imports
**File:** `src/sites.anon/features/pages/landing/_sharedparts/module.ts`

```typescript
// REMOVE:
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// In @NgModule imports, REMOVE:
ScrollToModule.forRoot()
```

#### Step 3.4: Update All Scroll Navigation Links
- [ ] Find all `[ngx-scroll-to]` directives in templates
- [ ] Replace with `(click)="scrollService.scrollToElement('id')"`
- [ ] Update anchor links to use the new service

#### Step 3.5: Remove Old Package
```bash
npm uninstall @nicky-lenaers/ngx-scroll-to
```

#### Step 3.6: Test & Verify
- [ ] Test all navigation links on landing page
- [ ] Verify smooth scroll behavior
- [ ] Test on mobile devices
- [ ] Check accessibility (keyboard navigation)
- [ ] Verify scroll offset is correct

#### Step 3.7: Commit
```bash
git add .
git commit -m "refactor: Replace @nicky-lenaers/ngx-scroll-to with custom scroll service"
```

---

### Phase 4: Remove `intersection-observer` Polyfill
**Duration:** < 1 hour  
**Risk Level:** LOW (modern browsers have native support)

#### Step 4.1: Remove Import
**File:** `src/polyfills.ts`

```typescript
// REMOVE THIS LINE:
import 'intersection-observer';
```

#### Step 4.2: Remove Package
```bash
npm uninstall intersection-observer
```

#### Step 4.3: Update Browser Support Documentation
- [ ] Verify `browserslist` in package.json covers supported browsers
- [ ] Update any documentation about browser requirements

#### Step 4.4: Test & Verify
- [ ] Test in all supported browsers
- [ ] Verify lazy-loading still works
- [ ] Check any components using IntersectionObserver

#### Step 4.5: Commit
```bash
git add .
git commit -m "refactor: Remove intersection-observer polyfill"
```

---

### Phase 5: Final Testing & Cleanup
**Duration:** 1 day

#### Step 5.1: Comprehensive Testing
- [ ] Run all unit tests
- [ ] Run all e2e tests
- [ ] Manual testing of all affected features
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility testing

#### Step 5.2: Update Documentation
- [ ] Update package.json
- [ ] Update any developer documentation
- [ ] Add migration notes to CHANGELOG.md

#### Step 5.3: Code Review
- [ ] Submit pull request
- [ ] Address review comments
- [ ] Get approval from team lead

#### Step 5.4: Merge & Deploy
```bash
git checkout main
git merge refactor/remove-deprecated-packages
git push origin main
```

---

## ? Success Criteria

- [ ] All deprecated packages removed from package.json
- [ ] No build warnings about deprecated packages
- [ ] All existing functionality works identically
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility maintained
- [ ] Accessibility standards met
- [ ] Code reviewed and approved
- [ ] Successfully deployed to production

---

## ?? Rollback Plan

If critical issues are discovered:

1. **Immediate Rollback:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Reinstall Old Packages:**
   ```bash
   npm install @nicky-lenaers/ngx-scroll-to@^14.0.0
   npm install ngx-slider-v2@^17.0.0
   npm install intersection-observer@^0.12.2
   ```

3. **Revert Code Changes:**
   - Restore all changed files from previous commit
   - Re-run build and tests
   - Deploy rollback

---

## ?? Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Preparation | 1-2 days | None |
| Phase 2: Replace ngx-slider-v2 | 1 day | Phase 1 complete |
| Phase 3: Replace ngx-scroll-to | 2-3 days | Phase 1 complete |
| Phase 4: Remove intersection-observer | < 1 hour | Phase 1 complete |
| Phase 5: Final Testing | 1 day | Phases 2-4 complete |
| **Total** | **5-7 days** | |

---

## ?? Notes

- Phases 2, 3, and 4 can be done in parallel if resources allow
- Each phase should be tested independently before moving to the next
- Keep the old packages installed until all replacements are complete and tested
- Consider feature flags if deploying incrementally

---

## ?? References

- [@angular-slider/ngx-slider Documentation](https://github.com/angular-slider/ngx-slider)
- [Angular ViewportScroller API](https://angular.io/api/common/ViewportScroller)
- [MDN: IntersectionObserver Browser Support](https://caniuse.com/intersectionobserver)
- [Window.scrollTo() MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo)
