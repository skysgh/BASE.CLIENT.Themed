# Theme Dependency Strategy

**Decision Date**: 2025-01-25  
**Status**: ⚠️ **PROPOSED (Deferred - Not Implementing Now)**  
**Context**: Sites needs UI components, but themes are 3rd party (can't modify)

---

## ⚠️ **IMPORTANT: This is a FUTURE Strategy**

### **Current Reality (Year 1-3):**
```typescript
// Sites directly use 3rd party theme (CURRENT APPROACH):
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// ✅ This is FINE for now!
```

**Why This is OK:**
- Simple and clear ✅
- Works today ✅
- Junior devs understand it ✅
- No unnecessary complexity ✅
- Theme change is 3+ years away ✅

---

### **When to Implement This Strategy:**

**Triggers:**
- Year 3+: Need to upgrade theme
- Multiple themes needed simultaneously
- Theme vendor discontinues support
- Significant theme breaking changes

**NOT Now:**
- ❌ YAGNI (You Ain't Gonna Need It... yet)
- ❌ Adds complexity without immediate benefit
- ❌ Extra maintenance burden
- ❌ Confuses junior developers

---

## 🎯 **The Strategy (When Needed)**

### **Problem We're Solving (Future):**
When we need to change themes in 3+ years, direct coupling will be painful.

### **Solution (Then, Not Now):**

**Adapter Pattern:**
```
Sites → Adapters (YOUR code) → 3rd Party Theme
```

**Benefits (Future):**
- Swappable themes
- Gradual migration
- Sites code unchanged

---

## 📝 **How It Would Work (Reference)**

### **1. Create Thin Adapters**

```typescript
// themes/t1/adapters/button.adapter.ts (FUTURE)

@Component({
  selector: 'app-button',
  template: `<button [class]="getThemeClasses()">...</button>`
})
export class ButtonAdapter {
  @Input() variant: 'primary' | 'secondary';
  // Maps YOUR semantics to theme's classes
}
```

### **2. Sites Use Adapters**

```typescript
// sites/components/... (FUTURE)
<app-button variant="primary">Save</app-button>
```

### **3. Swap Themes**

```typescript
// Change theme by swapping adapter module (FUTURE)
import { ThemeT2AdaptersModule } from 'themes/t2/adapters';
```

---

## 🎯 **Current Decision**

### **We Accept:**
- Sites directly use 3rd party themes (for now) ✅
- This creates coupling (acceptable for 3 years) ✅
- Will revisit when theme change actually needed ✅

### **We Document:**
- ✅ Strategy for future theme migration
- ✅ Adapter pattern as reference
- ✅ When to implement (triggers)

### **We Don't:**
- ❌ Implement adapters now (YAGNI)
- ❌ Add complexity prematurely
- ❌ Over-engineer for hypothetical future

### **Result:**
- Simple architecture today ✅
- Strategy documented for future ✅
- Flexibility preserved ✅
- No unnecessary complexity ✅

---

## 📊 **Timeline**

### **Year 1-3: Current Approach**
```typescript
// Direct theme usage:
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
```
**Status**: ✅ Working, simple, maintainable

### **Year 3+: IF Theme Change Needed**
```typescript
// Then implement adapter pattern:
import { ThemeT2AdaptersModule } from 'themes/t2/adapters';
```
**Status**: 📋 Documented, ready when needed

---

## 💡 **Key Principles**

### **YAGNI (You Ain't Gonna Need It)**
> "Don't implement features you don't need today."

**Why:**
- Adds complexity
- Maintenance burden
- May never be needed
- Requirements may change

### **KISS (Keep It Simple, Stupid)**
> "Simplest solution that works is best."

**Why:**
- Easier to understand
- Faster to implement
- Fewer bugs
- Junior devs can maintain

### **Document, Don't Implement**
> "Know HOW to solve it when needed, but don't solve it prematurely."

**Why:**
- Strategy is ready when needed
- No complexity burden today
- Can adapt to actual requirements
- Flexibility preserved

---

## 📋 **When to Revisit This**

### **Triggers to Implement Adapters:**

1. **Theme Change Needed** (Year 3+)
   - Current theme outdated
   - New design system required
   - Vendor discontinues support

2. **Multiple Themes Required**
   - Per-account theme selection
   - A/B testing different designs
   - White-label requirements

3. **Breaking Changes**
   - Theme major version upgrade
   - Significant API changes
   - Migration path unclear

### **Decision Process:**

```
Theme Change Needed?
   ↓
Assess Effort:
- Direct migration: X hours
- Adapter approach: Y hours
   ↓
If Y < X AND future-proofs: Implement adapters
If X < Y: Direct migration
```

---

## 🚀 **Immediate Actions**

### **Do Now:**
1. ✅ Keep current architecture (direct theme usage)
2. ✅ Focus on immediate value (docs, types, splash)
3. ✅ Document this strategy (for future reference)

### **Don't Do Now:**
1. ❌ Create adapter layer
2. ❌ Migrate sites to adapters
3. ❌ Add unnecessary abstraction

### **Keep for Reference:**
1. 📋 Adapter pattern examples
2. 📋 Migration strategy
3. 📋 Implementation checklist

---

## 📚 **Reference Files (For Future)**

**Keep These (Documentation):**
- ✅ `core.ag/contracts/ui-components.contracts.ts` (interfaces)
- ✅ `themes/t1/adapters/button/button.adapter.ts` (example)
- ✅ This ADR (strategy document)

**Status**: Reference only, not currently used

**Purpose**: When theme change is actually needed (Year 3+), these serve as:
- Implementation guide
- Working examples
- Proven pattern

---

## ✅ **Final Decision**

### **Status**: ⚠️ **Proposed (Deferred)**

**Meaning:**
- Strategy is **documented** ✅
- Pattern is **validated** ✅
- Examples are **created** ✅
- Implementation is **deferred** ⏳

**When to Implement:**
When theme change is actually needed (Year 3+), not before.

**Current Approach:**
Sites directly use 3rd party theme (simple, clear, works).

---

**Remember:**
> "Premature optimization is the root of all evil." — Donald Knuth

**Principle:**
> "Document the strategy, don't implement prematurely."

**Reality:**
> "Theme change is 3+ years away. Keep it simple for now."

---

**Version**: 2.0 (Revised - Deferred Implementation)  
**Created**: 2025-01-25  
**Status**: Documented for future reference  
**Review**: When theme change is actually needed
