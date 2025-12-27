# Pre-Launch Critical Testing

**Created:** 2025-12-27  
**Status:** ✅ Active - Enforcing Developer Accountability  
**Purpose:** Run critical tests BEFORE browser opens

---

## 🎯 The Problem We're Solving

**Without Pre-Launch Tests:**
```
Developer:
1. npm start
2. Browser opens immediately
3. Code changes
4. App looks fine visually
5. Commit
6. ❌ Tests fail in CI/CD (too late!)
```

**With Pre-Launch Tests:**
```
Developer:
1. npm start
2. ✅ Critical tests run (5-10s)
3. ✅ Tests pass → Browser opens
   OR
   ❌ Tests fail → Server doesn't start, dev must fix!
4. Code changes
5. Commit (confident tests pass)
6. ✅ CI/CD passes!
```

---

## ⚡ Performance Targets

### **Current State (90 Core Tests):**

| Test Suite | Tests | Time | Status |
|------------|-------|------|--------|
| **Core Services** | 90 | ~6s | ✅ Fast! |
| **Critical Only** | 90 | ~6s | ✅ Acceptable! |

### **Future State (500 Tests):**

| Test Suite | Tests | Time | When to Run |
|------------|-------|------|-------------|
| **Critical (Core)** | 150 | ~10s | Pre-launch ✅ |
| **Full Suite** | 500 | ~60s | On-demand ✅ |
| **E2E Tests** | 100 | ~5 min | CI/CD only ✅ |

**Result:** Always under 10 seconds pre-launch! ✅

---

## 📋 Available Commands

### **For Development:**

```sh
# Standard start (WITH pre-launch tests)
npm start
# → Runs critical tests → Opens browser

# Fast start (SKIP tests - emergency only!)
npm run start:fast
# → Skips tests → Opens browser immediately

# Watch mode (tests re-run on save)
npm run test:watch
# → Interactive, browser-based
```

---

### **For Testing:**

```sh
# Critical tests only (what runs pre-launch)
npm run test:critical
# → Core services only (~6s)

# All tests (comprehensive)
npm run test:all
# → Full suite with coverage (~60s)

# Generate metrics report
npm run test:report
# → Full suite + JSON/MD reports

# CI/CD mode
npm run test:ci
# → Headless + coverage
```

---

## 🎨 Console Output Example

### **Success (Tests Pass):**

```
> npm start

Running critical tests (core services only)...

Chrome Headless 120.0.0.0 (Windows 10):
  ✅ AccountService (Core Tier)
     ✅ should load default account (52ms)
     ✅ should load foo account (48ms)
     ✅ should handle errors gracefully (51ms)
     ... (25 tests)
  
  ✅ ResourceUrlService (Core Tier)
     ✅ should return tier-agnostic path (35ms)
     ✅ should handle production mode (42ms)
     ... (40 tests)
  
  ✅ ConfigRegistryService (Core Tier)
     ✅ should register config (28ms)
     ✅ should retrieve config (25ms)
     ... (25 tests)

╔═══════════════════════════════════════════════════╗
║  CRITICAL TESTS: 90 PASSED in 6.2 seconds        ║
╚═══════════════════════════════════════════════════╝

✅ All critical tests passed!
🚀 Starting development server...

** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

---

### **Failure (Tests Fail):**

```
> npm start

Running critical tests (core services only)...

Chrome Headless 120.0.0.0 (Windows 10):
  ✅ AccountService (Core Tier)
     ✅ should load default account (52ms)
     ❌ should load foo account (FAILED)
        
        Expected: AccountConfig { subdomain: 'foo', name: 'Foo Account' }
        Received: AccountConfig { subdomain: 'default', name: 'Default Account' }
        
        at account.service.spec.ts:45:12

TOTAL: 89 SUCCESS, 1 FAILED in 6.2 seconds

╔═══════════════════════════════════════════════════╗
║  ❌ CRITICAL TESTS FAILED!                        ║
╚═══════════════════════════════════════════════════╝

❌ Server will NOT start until tests pass.

💡 To debug:
   npm run test:watch
   (Opens browser with test results)

💡 To bypass tests (NOT recommended):
   npm run start:fast
   (Skips tests, starts server immediately)

💡 To see full error:
   Check output above for test failure details
```

**Result:** Server doesn't start, dev must fix!

---

## 🔧 What Gets Tested Pre-Launch?

### **Included (Critical):**

✅ **Core Services** (`core/services/*.spec.ts`)
- AccountService
- ResourceUrlService
- ConfigRegistryService
- Any service in `core/` tier

**Why:** Foundation must be solid. If core breaks, everything breaks.

**Time:** ~6-10 seconds (90-150 tests)

---

### **Excluded (Run on Demand):**

❌ **Component Tests** (`core.ag/`, `sites.*/`)
- Slower (need DOM rendering)
- Less critical (UI bugs don't block development)

❌ **Integration Tests**
- Slow (multiple services interacting)
- Better suited for CI/CD

❌ **E2E Tests**
- Very slow (5+ minutes)
- CI/CD only

**Why:** Keep pre-launch fast (<10s)

**Run Manually:** `npm run test:all`

---

## 📊 Test Selection Strategy

### **Tier Priority:**

| Tier | Pre-Launch? | Rationale |
|------|-------------|-----------|
| **Core** | ✅ YES | Foundation - must be solid |
| **Core.Ag** | ⏳ Future | When core stable, add these |
| **Themes** | ❌ NO | UI - visual testing better |
| **Sites** | ❌ NO | Integration - E2E better |

### **Test Type Priority:**

| Type | Pre-Launch? | Rationale |
|------|-------------|-----------|
| **Unit (Services)** | ✅ YES | Fast, critical logic |
| **Unit (Components)** | ❌ NO | Slower, less critical |
| **Integration** | ❌ NO | Slow, better in CI/CD |
| **E2E** | ❌ NO | Very slow, CI/CD only |

---

## 🎯 Developer Workflow

### **Standard Development:**

```sh
# 1. Start work session
npm start
# ✅ Tests pass (6s)
# ✅ Browser opens

# 2. Make changes
# ... code changes ...

# 3. Save file
# ✅ Browser auto-refreshes

# 4. Check if tests still pass (optional)
npm run test:watch
# ✅ Watch mode for active development

# 5. Commit
git add .
git commit -m "feat: ..."
# ✅ Confident tests pass (ran at start)
```

---

### **Emergency Bypass (Use Sparingly!):**

```sh
# When you need to:
# - Show demo to stakeholder (tests failing but UI works)
# - Debug visual issue (don't care about tests right now)
# - Quick prototype (will fix tests later)

npm run start:fast
# ⚠️ Skips tests
# ⚠️ Browser opens immediately
# ⚠️ No safety net!

# But remember:
# - Fix tests before committing!
# - CI/CD will catch failures anyway
# - Use start:fast as last resort only
```

---

## 🚨 Troubleshooting

### **Problem: Tests are slow (>10s)**

**Solution 1: Reduce test scope**
```json
// package.json
"test:critical": "ng test --include='**/core/services/*.spec.ts'"
// Only services, not all of core
```

**Solution 2: Parallel execution**
```sh
npm install --save-dev karma-parallel
```

**Solution 3: Profile slow tests**
```sh
npm run test:critical -- --reporters=junit
# Check which tests take longest
```

---

### **Problem: Flaky tests block everyone**

**Solution 1: Fix flaky tests immediately**
- Flaky test = highest priority bug
- Block all work until fixed
- Root cause: async timing, shared state

**Solution 2: Temporarily exclude flaky test**
```typescript
// Temporarily skip flaky test
xit('flaky test', () => {  // ← 'xit' skips test
  // TODO: Fix flaky async timing
});
```

**Solution 3: Add retry logic (last resort)**
```json
// karma.conf.js
module.exports = function(config) {
  config.set({
    retryLimit: 2  // Retry failed tests twice
  });
};
```

---

### **Problem: Developers always use start:fast**

**Solution 1: Team culture**
- Code review: Check if tests pass
- Standup: Discuss testing importance
- Metrics: Track who skips tests

**Solution 2: Pre-commit hook (enforce)**
```sh
# .husky/pre-commit
npm run test:all
# ✅ Can't commit if tests fail
```

**Solution 3: CI/CD protection**
```yaml
# .github/workflows/pr.yml
- name: Run tests
  run: npm run test:ci
- name: Block merge if failed
  if: failure()
  run: exit 1
```

---

## 📈 Success Metrics

### **After 1 Week:**

**Expected:**
- ✅ Devs use `npm start` (not `start:fast`)
- ✅ CI/CD failures decrease
- ✅ Confidence in codebase increases

**Measure:**
- `npm start` usage: 90%+
- `npm run start:fast` usage: <10%
- CI/CD test failures: -50%

---

### **After 1 Month:**

**Expected:**
- ✅ Tests run automatically (habit)
- ✅ Zero "I'll fix tests later"
- ✅ Core services: 100% coverage

**Measure:**
- Test pass rate: 95%+
- Coverage (core): 80%+
- Developer satisfaction: High

---

## 🎓 Best Practices

### **DO:**

✅ **Run critical tests pre-launch**
```sh
npm start  # Always use this
```

✅ **Fix failing tests immediately**
- Treat test failures as P0 bugs
- Don't let them accumulate

✅ **Keep critical suite fast**
- Target: <10 seconds
- Profile and optimize slow tests

✅ **Add tests for new features**
- New service → add to critical suite
- New component → add to full suite

---

### **DON'T:**

❌ **Bypass tests routinely**
```sh
npm run start:fast  # Emergency only!
```

❌ **Commit failing tests**
- Always fix before committing
- Use pre-commit hooks to enforce

❌ **Ignore flaky tests**
- Fix immediately
- Flaky = broken

❌ **Add slow tests to critical suite**
- Keep critical suite fast
- Move slow tests to full suite

---

## 📚 Related Documentation

- **Test Helpers:** `_custom/documentation/testing/TIER-ISOLATED-TESTING.md`
- **Metrics Dashboard:** `_custom/documentation/testing/TEST-METRICS-DASHBOARD.md`
- **Testing Strategy:** `_custom/documentation/testing/TESTING-STRATEGY-MULTI-LAYER.md`
- **Phase 1 Complete:** `_custom/documentation/testing/PHASE-1-DAY-1-COMPLETE.md`

---

## 🎯 Summary

**What We Built:**
- ✅ Pre-launch critical tests (run before browser opens)
- ✅ Fast execution (6-10 seconds)
- ✅ Developer accountability (can't skip tests easily)
- ✅ Emergency bypass (start:fast for demos)

**Benefits:**
- ✅ Catch issues immediately (before visual testing)
- ✅ Prevent "I'll fix tests later" mentality
- ✅ Build confidence in codebase
- ✅ Reduce CI/CD failures

**Commands:**
```sh
npm start          # Standard (with tests) ✅
npm run start:fast # Emergency (skip tests) ⚠️
npm run test:critical  # Run critical tests only
npm run test:all   # Run full test suite
```

---

**Status:** ✅ **Active - Enforcing Quality from Day 1**  
**Next:** Monitor adoption, adjust test scope as needed  
**Review:** After 1 week of usage

---

**Last Updated:** 2025-12-27  
**Document Version:** 1.0  
**Status:** Production-Ready
