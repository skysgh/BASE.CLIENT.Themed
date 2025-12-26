# Code Documentation Standards

**Purpose**: Ensure code is maintainable by developers of ALL skill levels  
**Audience**: Junior to mid-level Angular developers  
**Philosophy**: Over-document rather than under-document

---

## 🎯 **Core Principles**

### **1. Explain WHY, Not Just WHAT**

```typescript
// ❌ BAD: States the obvious
// This is a user service
export class UserService {}

// ✅ GOOD: Explains purpose and design decisions
/**
 * User Service
 * 
 * Manages user authentication state and profile data.
 * 
 * Design Decision: Uses BehaviorSubject instead of Observable
 * because we need to provide the current user state immediately
 * to late subscribers (e.g., route guards that activate after navigation starts).
 * 
 * Security Note: User data is cached in memory but never persisted
 * to localStorage due to XSS concerns. See ADR-005.
 * 
 * @see ADR-005 for security rationale
 * @see AuthGuard for usage example
 */
export class UserService {}
```

---

### **2. Document Non-Obvious Code Blocks**

```typescript
// ❌ BAD: No context
const value = input.split('/').slice(-1)[0];

// ✅ GOOD: Explains what and why
// Extract filename from full path
// Example: "/assets/images/logo.png" → "logo.png"
// Reasoning: We only need filename for display, not full path
const value = input.split('/').slice(-1)[0];
```

---

### **3. Comment Complex Logic**

```typescript
// ❌ BAD: Dense, uncommented
return items.filter(x => x.active)
  .map(x => ({ ...x, computed: x.value * 1.2 }))
  .reduce((acc, x) => acc + x.computed, 0);

// ✅ GOOD: Step-by-step explanation
// Calculate total value with markup:
// 1. Filter to only active items (inactive items shouldn't contribute)
return items
  .filter(x => x.active)
  
  // 2. Apply 20% markup to each item's value
  .map(x => ({ 
    ...x, 
    computed: x.value * 1.2  // 1.2 = 120% (100% + 20% markup)
  }))
  
  // 3. Sum all computed values
  .reduce((acc, x) => acc + x.computed, 0);
```

---

### **4. Explain Design Patterns**

```typescript
/**
 * Dependency Injection Pattern
 * 
 * Why we use this:
 * - Services are provided via Angular DI, not direct imports
 * - Makes code testable (can inject mocks)
 * - Follows Angular best practices
 * 
 * For beginners:
 * - The @Inject() decorator tells Angular what to provide
 * - The token (DEPLOYED_RESOURCES) is defined in sites/tokens/
 * - The actual value is provided in apps.bootstrap/module.ts
 * 
 * Think of it like ordering from a restaurant:
 * - You order "coffee" (token)
 * - Kitchen decides how to make it (provider)
 * - You get coffee without knowing recipe (abstraction)
 * 
 * @see sites/tokens/deployed-resource.tokens.ts for token definition
 * @see apps.bootstrap/module.ts for provider configuration
 */
constructor(
  @Inject(DEPLOYED_RESOURCES) private deployed: DeployedResourcePaths
) {}
```

---

### **5. Document Type Hierarchies**

```typescript
/**
 * Applets Constants Type Definition
 * 
 * Purpose:
 * This type defines the structure of configuration for app.lets tier.
 * Each applet (education, scheduling, etc.) uses this structure.
 * 
 * Architecture:
 * - Extends TBaseConstants (shared properties across all tiers)
 * - Adds applet-specific concerns (apis, assets, resources)
 * 
 * Benefits of this pattern:
 * 1. IntelliSense: Developers get autocomplete
 * 2. Type Safety: Catch mistakes at compile time
 * 3. Documentation: Types show what's available
 * 4. Refactoring: Changes propagate automatically
 * 
 * Single Responsibility:
 * This type ONLY defines structure. Implementation is in:
 * @see implementations/app.lets.constants.ts
 * 
 * Related Types:
 * @see TAppletsConstantsApis for API structure
 * @see TAppletsConstantsAssets for asset structure
 * @see TAppletsConstantsResources for resource structure
 * 
 * Example Usage:
 * ```typescript
 * // Consumer uses the type for IntelliSense:
 * const config: TAppletsConstants = appletsConstants;
 * config.apis.???  // ← Full autocomplete here!
 * ```
 */
export type TAppletsConstants = TBaseConstants & {
  /**
   * API endpoint configuration
   * Contains URLs for backend services
   */
  apis: TAppletsConstantsApis,
  
  /**
   * Static asset paths (deployed with app)
   * Examples: HTML templates, images, icons
   */
  assets: TAppletsConstantsAssets,
  
  /**
   * Resource paths (runtime content)
   * Examples: User uploads, dynamic media
   */
  resources: TAppletsConstantsResources
}
```

---

### **6. Explain Trade-offs**

```typescript
/**
 * ROOT_RELATIVE_PATH Pattern
 * 
 * Decision: Include trailing slash in constant
 * 
 * Why:
 * Safer string concatenation. Can't forget the slash.
 * 
 * Example:
 * ```typescript
 * // With trailing slash (our approach):
 * const path = ROOT_RELATIVE_PATH + 'assets';  // ✅ "app.lets/assets"
 * 
 * // Without trailing slash (risky):
 * const path = ROOT_RELATIVE_PATH + 'assets';  // ❌ "app.letsassets" - oops!
 * ```
 * 
 * Trade-off:
 * - Pro: Impossible to forget slash
 * - Pro: Simpler concatenation
 * - Con: Slightly unconventional (most paths don't have trailing /)
 * 
 * Decision: Pro outweighs con. Safety > convention.
 * 
 * @see _custom/documentation/patterns/ROOT-RELATIVE-PATH-pattern.md
 */
export const ROOT_RELATIVE_PATH = 'app.lets/';  // ← Trailing slash is intentional!
```

---

## 🎓 **When to Document**

### **Always Document:**
- ✅ Public APIs (anything exported)
- ✅ Complex algorithms
- ✅ Non-obvious design decisions
- ✅ Workarounds (with reason + ticket number)
- ✅ Security-sensitive code
- ✅ Performance-critical sections
- ✅ Anything that made YOU pause and think

### **Can Skip:**
- Truly self-explanatory code (but err on side of documenting)
- Private methods with obvious names (but explain complex ones)
- Standard Angular patterns (but link to docs for beginners)

---

## 📝 **Documentation Templates**

### **Template: Type Definition**
```typescript
/**
 * [Type Name]
 * 
 * Purpose: [What this type represents]
 * 
 * Architecture: [How it fits in the system]
 * 
 * Benefits:
 * - [Benefit 1]
 * - [Benefit 2]
 * 
 * Related Types:
 * @see [Related type 1]
 * @see [Related type 2]
 * 
 * Example Usage:
 * ```typescript
 * [Code example]
 * ```
 */
export type TMyType = {
  /** [Property description] */
  property: Type;
}
```

### **Template: Service**
```typescript
/**
 * [Service Name]
 * 
 * Purpose: [What this service does]
 * 
 * Responsibilities:
 * - [Responsibility 1]
 * - [Responsibility 2]
 * 
 * Design Decisions:
 * - [Decision 1 with rationale]
 * - [Decision 2 with rationale]
 * 
 * Dependencies:
 * @see [Dependency 1] - [Why needed]
 * @see [Dependency 2] - [Why needed]
 * 
 * Usage Example:
 * ```typescript
 * [Code example]
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class MyService {}
```

### **Template: Complex Method**
```typescript
/**
 * [Method description]
 * 
 * What it does: [High-level explanation]
 * 
 * Why we do it this way: [Rationale]
 * 
 * Algorithm:
 * 1. [Step 1]
 * 2. [Step 2]
 * 3. [Step 3]
 * 
 * Edge Cases:
 * - [Edge case 1]: [How handled]
 * - [Edge case 2]: [How handled]
 * 
 * @param param1 - [Description]
 * @param param2 - [Description]
 * @returns [What it returns]
 * 
 * @example
 * ```typescript
 * [Usage example]
 * ```
 */
public complexMethod(param1: Type, param2: Type): ReturnType {
  // Implementation with inline comments
}
```

---

## 🚫 **Anti-Patterns to Avoid**

### **1. Stating the Obvious**
```typescript
// ❌ BAD:
// This increments the counter
counter++;

// ✅ GOOD: (No comment needed - code is self-documenting)
counter++;
```

### **2. Out-of-Date Comments**
```typescript
// ❌ BAD:
// Returns the user's email
public getUserPhone(): string { /* ... */ }  // ← Comment lies!

// ✅ GOOD:
/**
 * Returns user's primary phone number
 * Falls back to secondary if primary is not set
 */
public getUserPhone(): string { /* ... */ }
```

### **3. Commenting Every Line**
```typescript
// ❌ BAD:
// Declare a variable
let count = 0;
// Loop through items
for (let item of items) {
  // Increment count
  count++;
}

// ✅ GOOD:
// Count active items (inactive items are filtered earlier)
let count = 0;
for (let item of items) {
  count++;
}
```

---

## 🎯 **Documentation Checklist**

Before committing code, ask:

- [ ] Would a junior developer understand this?
- [ ] Have I explained WHY, not just WHAT?
- [ ] Are design decisions documented?
- [ ] Are non-obvious patterns explained?
- [ ] Are related files cross-referenced?
- [ ] Are examples provided for complex APIs?
- [ ] Are edge cases documented?
- [ ] Are security considerations noted?

---

## 📚 **Resources**

**Internal:**
- ADRs (Architecture Decision Records) - Why we chose X over Y
- Pattern docs - How to use established patterns
- Training materials - For onboarding

**External:**
- TSDoc syntax: https://tsdoc.org/
- Angular style guide: https://angular.io/guide/styleguide

---

## 🎓 **For Junior Developers**

**Reading Code:**
1. Start with file-level comment (what is this file?)
2. Read type definitions (what's the structure?)
3. Read public methods (what can I do?)
4. Read inline comments (how does it work?)

**Writing Code:**
1. Write the code
2. Add inline comments for complex parts
3. Write method-level documentation
4. Write type-level documentation
5. Add cross-references
6. Ask: "Will I understand this in 6 months?"

---

**Philosophy**: 
> "Code is written once, read many times. Optimize for reading."

**Standard**:
> "When in doubt, document. Better too much than too little."

**Remember**:
> "You're not just writing code for yourself. You're writing for the next developer - who might be you in 6 months after you've forgotten everything!"

---

**Version**: 1.0  
**Last Updated**: 2025-01-25  
**Owner**: Architecture Team  
**Review Frequency**: Quarterly
