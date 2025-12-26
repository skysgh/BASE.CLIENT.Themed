# Code Review Checklist - Documentation

**Purpose**: Ensure all code meets documentation standards  
**Use**: Check this before every commit/PR  
**Target**: Junior-to-mid level developers can understand everything

---

## ✅ **File-Level Documentation**

Every file should have:

```typescript
/**
 * [File Name / Purpose]
 * 
 * Purpose: [What this file does]
 * 
 * Architecture: [How it fits in the system]
 * 
 * Responsibilities:
 * - [Responsibility 1]
 * - [Responsibility 2]
 * 
 * Related Files:
 * @see [Related file 1]
 * @see [Related file 2]
 * 
 * For Beginners:
 * [Explain concepts that junior devs might not know]
 */
```

**Checklist:**
- [ ] File has header comment
- [ ] Purpose is clear
- [ ] Architecture context explained
- [ ] Related files linked
- [ ] Beginner-friendly explanation included

---

## ✅ **Type Documentation**

Every exported type should have:

```typescript
/**
 * [Type Name]
 * 
 * Purpose: [What this type represents]
 * 
 * Why This Pattern: [Design rationale]
 * 
 * Related Types:
 * @see [Related type 1]
 * 
 * Example Usage:
 * ```typescript
 * [Code example]
 * ```
 * 
 * For Beginners:
 * [Explain TypeScript concepts if needed]
 */
export type TMyType = {
  /** [Property description] */
  property: Type;
}
```

**Checklist:**
- [ ] Type has JSDoc comment
- [ ] Purpose explained
- [ ] Design rationale documented
- [ ] Related types linked
- [ ] Example provided
- [ ] Beginner notes included
- [ ] All properties documented

---

## ✅ **Class/Service Documentation**

Every class/service should have:

```typescript
/**
 * [Class Name]
 * 
 * Purpose: [What this does]
 * 
 * Responsibilities:
 * - [Responsibility 1]
 * - [Responsibility 2]
 * 
 * Design Decisions:
 * - [Decision 1 with rationale]
 * 
 * Dependencies:
 * @see [Dependency 1] - [Why needed]
 * 
 * For Beginners:
 * [Explain patterns used]
 * 
 * @example
 * ```typescript
 * [Usage example]
 * ```
 */
@Injectable()
export class MyService {}
```

**Checklist:**
- [ ] Class has JSDoc comment
- [ ] Purpose clear
- [ ] Responsibilities listed
- [ ] Design decisions explained
- [ ] Dependencies documented
- [ ] Beginner notes included
- [ ] Usage example provided

---

## ✅ **Method Documentation**

Public methods should have:

```typescript
/**
 * [Method description]
 * 
 * What it does: [High-level explanation]
 * 
 * Why we do it this way: [Rationale]
 * 
 * @param param1 - [Description + valid values]
 * @param param2 - [Description + valid values]
 * @returns [What it returns + when]
 * 
 * @throws [Error type] - [When thrown]
 * 
 * @example
 * ```typescript
 * [Usage example]
 * ```
 */
public method(param1: Type, param2: Type): ReturnType {}
```

**Checklist:**
- [ ] Public methods have JSDoc
- [ ] Purpose explained
- [ ] All parameters documented
- [ ] Return value documented
- [ ] Exceptions documented
- [ ] Example provided (for complex methods)

---

## ✅ **Complex Code Blocks**

Code that's not immediately obvious should have:

```typescript
// [High-level explanation of what this block does]
// 
// Why: [Reason for this approach]
// 
// Steps:
// 1. [Step 1]
// 2. [Step 2]
const result = complexOperation()
  .then(...)  // [What this does]
  .catch(...) // [How errors are handled]
```

**Checklist:**
- [ ] Complex logic has inline comments
- [ ] "Why" is explained, not just "what"
- [ ] Algorithm steps documented
- [ ] Edge cases noted
- [ ] Error handling explained

---

## ✅ **Design Patterns**

When using patterns, document:

```typescript
/**
 * [Pattern Name] Pattern
 * 
 * Why we use this:
 * - [Reason 1]
 * - [Reason 2]
 * 
 * How it works:
 * [Explanation]
 * 
 * For Beginners:
 * [Analogy or simple explanation]
 * 
 * @see [Pattern documentation]
 */
```

**Checklist:**
- [ ] Pattern is named
- [ ] Rationale explained
- [ ] How it works documented
- [ ] Beginner-friendly explanation
- [ ] Link to pattern docs

---

## ✅ **TODOs and Technical Debt**

For TODOs:

```typescript
// TODO: [What needs to be done]
// Why: [Why it's needed]
// When: [Target completion]
// Who: [Responsible person/team]
// Ticket: [Jira ticket number]
```

**Checklist:**
- [ ] TODO has full context
- [ ] Reason documented
- [ ] Owner identified
- [ ] Ticket linked (if exists)

---

## ✅ **Security-Sensitive Code**

For security code:

```typescript
/**
 * [Operation name]
 * 
 * SECURITY NOTE:
 * [Why this is security-sensitive]
 * 
 * Mitigations:
 * - [Mitigation 1]
 * - [Mitigation 2]
 * 
 * References:
 * @see [Security ADR or documentation]
 */
```

**Checklist:**
- [ ] Security implications documented
- [ ] Mitigations explained
- [ ] References to security docs
- [ ] Reviewed by security-aware developer

---

## ✅ **Constants and Magic Numbers**

For constants:

```typescript
/**
 * [Constant name]
 * 
 * Purpose: [What it controls]
 * Value: [Why this specific value]
 * Impact: [What happens if changed]
 */
const MAX_RETRIES = 3;  // Based on network timeout testing (see ADR-042)
```

**Checklist:**
- [ ] Constants have explanatory comments
- [ ] Reason for value documented
- [ ] Impact of change noted
- [ ] Source referenced (if from research/testing)

---

## ✅ **Imports**

For non-obvious imports:

```typescript
// Dependency Injection tokens from Sites tier
// These are provided in apps.bootstrap/module.ts
import { DEPLOYED_RESOURCES, PUBLIC_NAVIGATION } from '../sites/tokens';
```

**Checklist:**
- [ ] Import groups have headers
- [ ] Non-obvious imports explained
- [ ] Token providers identified (for DI)

---

## ❌ **Anti-Patterns to Avoid**

### **Don't:**

```typescript
// ❌ Stating the obvious
// This is a user
export class User {}

// ❌ Out-of-date comments
// Returns email
public getPhone() {}  // ← Wrong!

// ❌ Commenting every line
let x = 1;  // Set x to 1
let y = 2;  // Set y to 2
```

### **Do:**

```typescript
// ✅ Explain design decisions
/**
 * User entity
 * 
 * Design: Immutable after creation (defensive copy pattern)
 * Security: Passwords are never stored (hashed only)
 */
export class User {}
```

---

## 🎯 **The "6-Month Test"**

Before committing, ask yourself:

> **"If I came back to this code in 6 months, having forgotten everything, would I understand it in 5 minutes?"**

If **NO** → Add more documentation!

---

## 📊 **Quality Metrics**

### **Good Documentation Has:**
- ✅ Explanation of WHY, not just WHAT
- ✅ Examples for complex APIs
- ✅ Links to related code
- ✅ Beginner-friendly explanations
- ✅ Design rationale
- ✅ Security considerations (where relevant)

### **Poor Documentation Has:**
- ❌ Only "what" statements
- ❌ No examples
- ❌ No cross-references
- ❌ Assumes expert knowledge
- ❌ No rationale
- ❌ Missing security notes

---

## ✅ **Final Checklist**

Before committing any code:

- [ ] All exported items documented
- [ ] Complex code has inline comments
- [ ] Design decisions explained
- [ ] Examples provided (where needed)
- [ ] Related files cross-referenced
- [ ] Junior developer could understand
- [ ] "6-Month Test" passes
- [ ] No out-of-date comments
- [ ] No `any` types without explanation
- [ ] TODOs have full context
- [ ] Security notes added (if applicable)

---

## 🚀 **Tools to Help**

### **VS Code Extensions:**
- **Document This** - Auto-generate JSDoc templates
- **Better Comments** - Highlight TODO, FIXME, etc.
- **TSDoc Comment** - Validate JSDoc syntax

### **Build Integration:**
- **TypeDoc** - Generate documentation site
- **Compodoc** - Angular-specific docs
- **ESLint rules** - Enforce JSDoc on exports

---

## 📚 **References**

**Internal:**
- `_custom/documentation/standards/CODE-DOCUMENTATION-STANDARDS.md`
- `_custom/documentation/patterns/TYPE-INTERFACE-PATTERN-QUICK-REF.md`
- `_custom/documentation/adr/` - Architecture decision records

**External:**
- [TSDoc](https://tsdoc.org/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

**Remember:**
> "Documentation is love for your future self and your teammates."

**Standard:**
> "When in doubt, document. Better too much than too little."

**Goal:**
> "A junior developer should be productive in 5 minutes, not 5 hours."

---

**Version**: 1.0  
**Last Updated**: 2025-01-25  
**Review Frequency**: Every commit/PR  
**Owner**: All developers
