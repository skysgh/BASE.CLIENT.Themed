# Understanding Dependency Injection Tokens - Complete Guide

**For**: Developer Training  
**Topic**: Token-Based Dependency Injection Pattern  
**Difficulty**: Beginner-Friendly  
**Time to Read**: 15-20 minutes

---

## 🎯 The Big Picture: What Problem Did We Solve?

### The Problem (In Simple Terms)

Imagine you have a filing cabinet with drawers:
- **Bottom drawer (Core)**: Basic tools everyone uses
- **Middle drawer (Sites)**: Your website pages
- **Top drawer (Apps.Main)**: The main application settings

**The Problem**: Your website pages (Sites) were reaching UP into the top drawer (Apps.Main) to grab things like:
- Logo image paths
- Where to navigate when clicking "Sign In"
- API server URLs

### Why is this bad?

1. **Tight Coupling**: If you want to reuse your website pages in another app, they're stuck because they need that specific top drawer
2. **Hard to Test**: Can't fake the paths for testing
3. **Breaks Architecture**: Like a receptionist demanding access to the CEO's desk!
4. **Inflexible**: Can't change paths without changing component code

---

## ✅ The Solution: Dependency Injection (The "Waiter Pattern")

Instead of components reaching UP to grab what they need, we use a **"waiter"** pattern:

1. **Component says**: "I need a logo path" (doesn't care where it comes from)
2. **Waiter (Angular DI)**: Delivers the logo path from wherever it's configured
3. **Apps.Main**: Provides the actual path

### Restaurant Analogy

Think of it like ordering food:
- **You** (component): "I want a burger"
- **Waiter** (DI system): Brings you a burger
- **Kitchen** (Apps.Main): Makes the burger

**You don't go into the kitchen yourself!**

---

## 📂 What We Built (The 3-Part System)

### Part 1: The Menu (Contracts)

**Location**: `sites/contracts/`

These are like a menu - they describe what you CAN order:

```typescript
// sites/contracts/resource.contracts.ts
export interface ResourcePaths {
  logos: {
    light: string;  // "I need a light logo path"
    dark: string;   // "I need a dark logo path"
  },
  images: {
    root: string;
    trustedBy: string;
    flags: string;
    backgrounds: string;
  },
  files: {
    root: string;
    markdown: string;
    pdf: string;
  }
}
```

**Plain English**: "I need several things: paths to logos, image directories, and file directories"

**Why an Interface?**
- TypeScript can check if you're asking for valid things
- IDE gives you autocomplete
- Documents what's available

---

### Part 2: The Order Form (Tokens)

**Location**: `sites/tokens/`

These are like order forms - they let you place the order:

```typescript
// sites/tokens/resource.tokens.ts
import { InjectionToken } from '@angular/core';
import { ResourcePaths } from '../contracts';

export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');
```

**Plain English**: "This is the official form for ordering resource paths. 
When someone presents this form, give them what they asked for."

**What's an InjectionToken?**
- Angular's way of identifying what you're asking for
- Like a ticket number at a deli counter
- Type-safe (TypeScript knows what you'll get)

---

### Part 3: The Kitchen (Provider)

**Location**: `apps.main/module.ts`

This is where the actual values are stored and served:

```typescript
// apps.main/module.ts
@NgModule({
  providers: [{
    provide: RESOURCE_PATHS,  // "When someone orders this..."
    useValue: {               // "...give them this:"
      logos: {
        light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
        dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
      },
      images: {
        root: appsMainConstants.resources.open.images.root,
        trustedBy: appsMainConstants.resources.open.images.trustedBy,
        flags: appsMainConstants.resources.open.images.flags,
        backgrounds: appsMainConstants.resources.open.images.backgrounds
      },
      files: {
        root: appsMainConstants.resources.open.files.root,
        markdown: appsMainConstants.resources.open.files.markdownDir,
        pdf: appsMainConstants.resources.open.files.pdfDir
      }
    }
  }]
})
export class AppModule {}
```

**Plain English**: "When someone orders RESOURCE_PATHS, serve them these specific file paths."

**Why in Apps.Main?**
- Centralized configuration
- Easy to change for different environments
- Components don't need to know where values come from

---

## 🔨 How It Works (Step by Step)

### Step 1: Component Places Order

```typescript
// sites/components/header/component.ts
import { RESOURCE_PATHS, ResourcePaths } from '../../../../../../tokens';

export class HeaderComponent {
  // Step 1a: Declare what you need (property type)
  public resources: ResourcePaths;
  
  constructor(
    // Step 1b: Ask for it when component is created
    @Inject(RESOURCE_PATHS) resources: ResourcePaths
  ) {
    // Step 1c: Store it for use in template
    this.resources = resources;
  }
}
```

**What's happening**:
1. Component says: "I need RESOURCE_PATHS" (`@Inject(RESOURCE_PATHS)`)
2. Angular DI (the waiter) says: "Let me check with the kitchen..." (looks up provider)
3. Apps.Main (the kitchen) says: "Here you go!" (returns the value object)
4. Component stores them in `this.resources` (parameter → property)

**Key Points**:
- `@Inject()` is the decorator that tells Angular "get this from DI"
- The parameter name `resources` can be anything (it's local)
- The property `this.resources` must match template usage
- Type `ResourcePaths` gives you autocomplete in IDE

---

### Step 2: Component Uses What It Got

```html
<!-- component.html -->
<img src="{{resources.logos.light}}" alt="logo">
<img src="{{resources.logos.dark}}" alt="logo">

<a [routerLink]="navigation.auth.signin">Sign In</a>
<a [routerLink]="navigation.auth.signup">Sign Up</a>
```

**What's happening**:
- Component uses `resources.logos.light` which now contains `/assets/open/images/logos/logo-light.png`
- Template doesn't know or care WHERE it came from!
- Angular's change detection updates the DOM when values change

**Key Points**:
- `{{}}` is interpolation (outputs value as text)
- `[property]` is property binding (sets element property)
- IDE autocomplete works because of TypeScript interface

---

## 📊 Before vs After (Visual Comparison)

### Before (Bad - Direct Import)

```typescript
// ❌ BAD: Component reaching UP to higher tier
import { appsMainConstants } from 'apps.main/constants';

export class HeaderComponent {
  // Hardcoded reference to Apps.Main
  public appsMainConstants = appsMainConstants;
}
```

```html
<!-- ❌ BAD: Using imported constant directly -->
<img src="{{appsMainConstants.resources.open.images.logos}}logo-light.png">
```

**Problems**:
1. **Upward Coupling**: Sites → Apps.Main (wrong direction!)
2. **Hard to Test**: Can't mock `appsMainConstants` (it's a direct import)
3. **Verbose Path**: Template has to know deep structure
4. **Can't Reuse**: Component tied to this specific constant structure
5. **Brittle**: If Apps.Main changes, component breaks

---

### After (Good - Dependency Injection)

```typescript
// ✅ GOOD: Component asks for what it needs
import { RESOURCE_PATHS, ResourcePaths } from '../../../../../../tokens';

export class HeaderComponent {
  public resources: ResourcePaths;
  
  constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) {
    this.resources = resources;
  }
}
```

```html
<!-- ✅ GOOD: Using injected property -->
<img src="{{resources.logos.light}}">
```

**Benefits**:
1. **No Upward Coupling**: Sites → Sites/tokens (same tier!)
2. **Easy to Test**: Can inject fake `ResourcePaths` in tests
3. **Clean Path**: Template just says `resources.logos.light`
4. **Reusable**: Any app can provide different paths
5. **Flexible**: Change paths without touching component

---

## 🗺️ The Flow (How Data Moves)

```
┌─────────────────────────────────────────────┐
│ 1. App Starts                               │
│    └─> Apps.Main module loads               │
│        └─> Registers providers:             │
│            "If anyone asks for              │
│             RESOURCE_PATHS, give            │
│             them these paths"               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. Header Component Created                 │
│    └─> Constructor says:                    │
│        "I need RESOURCE_PATHS"              │
│        └─> Angular DI checks:               │
│            "Who provides this?"             │
│            └─> Finds Apps.Main: "I do!"     │
│                └─> Delivers paths           │
│                    to component             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. Component Uses Paths                     │
│    └─> Template:                            │
│        {{resources.logos.light}}            │
│        └─> Renders:                         │
│            /assets/open/images/             │
│            logos/logo-light.png             │
│            └─> Browser loads image ✓        │
└─────────────────────────────────────────────┘
```

---

## 🎓 Real-World Analogy (Complete Version)

### Old Way (Direct Import) - Walking Into Kitchen

**Scenario**: You're at a restaurant

1. You walk past the "Staff Only" door
2. Go into the kitchen
3. Find ingredients in specific cabinets (must know exact locations)
4. Make your own burger
5. Walk back to your table

**Problems**: 
- Kitchen staff annoyed (architectural violation)
- You might grab wrong ingredients (no type checking)
- Kitchen might reorganize and you won't find things (brittle)
- Health inspector shuts down restaurant (fails code review!)

---

### New Way (Dependency Injection) - Ordering Properly

**Scenario**: You're at a restaurant

1. **Look at menu** (contracts) - "Burgers available"
2. **Fill out order form** (token) - "I want order #42: burger"
3. **Waiter takes order** (DI system) - "Got it, coming right up"
4. **Kitchen makes burger** (provider) - Uses actual ingredients
5. **Waiter brings food** (DI delivers) - Here's your burger!
6. **Enjoy meal** (use in template) - Eat without knowing how it was made

**Benefits**:
- Kitchen can reorganize - you don't care (change implementation)
- Chef can use different ingredients - you don't notice (swap providers)
- You can test different restaurants - same ordering process (testable)
- Health inspector happy - proper separation (passes code review)

---

## 📝 What We Created (File Checklist)

### Contracts (The Menu)

✅ `sites/contracts/resource.contracts.ts`
- Interface: `ResourcePaths`
- Describes: Logos, images, files structure

✅ `sites/contracts/api.contracts.ts`
- Interface: `ApiEndpoints`
- Describes: API URLs structure

✅ `sites/contracts/navigation.contracts.ts`
- Interface: `NavigationPaths`
- Describes: Route URLs structure

✅ `sites/contracts/index.ts`
- Barrel export: Exports all contracts

---

### Tokens (The Order Forms)

✅ `sites/tokens/resource.tokens.ts`
- Token: `RESOURCE_PATHS`
- Order form for: Resources

✅ `sites/tokens/api.tokens.ts`
- Token: `API_ENDPOINTS`
- Order form for: APIs

✅ `sites/tokens/navigation.tokens.ts`
- Token: `NAVIGATION_PATHS`
- Order form for: Navigation

✅ `sites/tokens/index.ts`
- Barrel export: Exports all tokens + contracts

---

### Provider (The Kitchen)

✅ `apps.main/module.ts`
- Providers: All three tokens
- Values: Actual paths from `appsMainConstants` and `sitesConfiguration`

---

### Example (Proof It Works)

✅ `sites/components/header/component.ts`
- Injects: `RESOURCE_PATHS` and `NAVIGATION_PATHS`
- Uses: In component logic

✅ `sites/components/header/component.html`
- Uses: `resources.logos.light`, `resources.logos.dark`
- Uses: `navigation.auth.signin`, `navigation.auth.signup`

---

## 🧪 Testing Example (Why This Matters)

### Before (Can't Test Easily)

```typescript
import { appsMainConstants } from 'apps.main/constants';

// Can't change where logo comes from - it's hardcoded!
const component = new HeaderComponent();

// Logo path is whatever appsMainConstants says
// Can't fake it for testing
// Can't test different scenarios
```

**Problems**:
- Imports real `appsMainConstants` (production data in tests!)
- Can't test edge cases (what if logo URL is invalid?)
- Tests fail if paths change
- Can't test offline

---

### After (Easy to Test)

```typescript
import { TestBed } from '@angular/core/testing';
import { RESOURCE_PATHS } from '../../tokens';

// Create fake paths for testing
const mockResources = {
  logos: {
    light: '/test/fake-logo-light.png',
    dark: '/test/fake-logo-dark.png'
  },
  images: {
    root: '/test/images/',
    trustedBy: '/test/trusted/',
    flags: '/test/flags/',
    backgrounds: '/test/backgrounds/'
  },
  files: {
    root: '/test/files/',
    markdown: '/test/markdown/',
    pdf: '/test/pdf/'
  }
};

// Give fake paths to component
TestBed.configureTestingModule({
  declarations: [HeaderComponent],
  providers: [
    { provide: RESOURCE_PATHS, useValue: mockResources }
  ]
});

const fixture = TestBed.createComponent(HeaderComponent);
const component = fixture.componentInstance;

// Component uses fake paths - perfect for testing!
expect(component.resources.logos.light).toBe('/test/fake-logo-light.png');
```

**Benefits**:
- Complete control over test data
- Can test edge cases (empty strings, nulls, invalid URLs)
- Fast (no real file system access)
- Isolated (doesn't depend on production config)

---

## 🎯 Key Takeaways (Remember These!)

### The 5-Part Pattern

1. **Contracts** = "What I need" (TypeScript interface)
2. **Tokens** = "How I ask for it" (Angular InjectionToken)
3. **Provider** = "Where it comes from" (NgModule providers array)
4. **Injection** = "Delivering it" (@Inject decorator in constructor)
5. **Usage** = "Using it" (in template or component code)

### The Flow

```
Define → Ask → Receive → Use
   ↓       ↓       ↓       ↓
Contract Token  Inject  Template
```

### Mental Model

```
Component = "Customer"
Token = "Order number"
Provider = "Kitchen"
DI System = "Waiter"
Template = "Eating the meal"
```

---

## ❓ Common Questions (FAQ)

### Q1: Why not just import directly?

**A**: Same reason you don't walk into restaurant kitchens:
- **Separation of concerns**: Kitchen and dining room are separate
- **Flexibility**: Kitchen can change without affecting customers
- **Testability**: Can test ordering process without real kitchen

### Q2: Isn't this more complicated?

**A**: Initial setup yes, but pays off when you need to:
- **Test**: Mock dependencies easily
- **Reuse**: Component works in different apps
- **Change**: Swap implementations without touching component
- **Scale**: Add more dependencies without changing pattern

### Q3: What if I want different paths in production vs development?

**A**: Easy! Just change the provider values - component doesn't care.

```typescript
// Development
providers: [{
  provide: RESOURCE_PATHS,
  useValue: { logos: { light: '/dev/logo.png' } }
}]

// Production
providers: [{
  provide: RESOURCE_PATHS,
  useValue: { logos: { light: '/prod/logo.png' } }
}]

// Component code stays the same!
```

### Q4: Can I inject multiple things?

**A**: Yes! Just add more `@Inject` parameters:

```typescript
constructor(
  @Inject(RESOURCE_PATHS) resources: ResourcePaths,
  @Inject(API_ENDPOINTS) apis: ApiEndpoints,
  @Inject(NAVIGATION_PATHS) navigation: NavigationPaths,
  private http: HttpClient,  // Regular Angular service
  private router: Router     // Another Angular service
) {
  this.resources = resources;
  this.apis = apis;
  this.navigation = navigation;
}
```

### Q5: What's the difference between `@Inject()` and regular service injection?

**A**: 
- **`@Inject(TOKEN)`**: Used for tokens (configuration, values)
- **No decorator**: Used for classes/services (has `@Injectable()`)

```typescript
constructor(
  @Inject(RESOURCE_PATHS) resources: ResourcePaths,  // Token injection
  private http: HttpClient                           // Service injection
) {}
```

### Q6: Where should I put tokens for my tier?

**A**: **Rule**: Each tier defines tokens for what IT needs to consume.

| You're In | Define Tokens In | Consume From | Provide From |
|-----------|-----------------|--------------|--------------|
| Sites | `sites/tokens/` | Sites tokens | Apps.Main |
| Applets | `applets/tokens/` | Applet tokens | Apps.Main |
| Themes | `themes/tokens/` | Theme tokens | Themes module |

### Q7: What if I forget to provide a token?

**A**: Angular will throw a clear error:

```
Error: NullInjectorError: No provider for InjectionToken resource.paths!
```

**Fix**: Add provider to `apps.main/module.ts`

### Q8: Can tokens be optional?

**A**: Yes! Use `@Optional()`:

```typescript
constructor(
  @Optional() @Inject(RESOURCE_PATHS) resources?: ResourcePaths
) {
  this.resources = resources ?? {
    logos: { light: '/default.png', dark: '/default.png' }
  };
}
```

---

## 🚀 Next Steps (Practice Exercises)

### Exercise 1: Read the Working Example (10 min)

1. Open `sites/components/header/component.ts`
2. Find the `@Inject()` decorators
3. See how `resources` and `navigation` are used
4. Open `component.html` and see template usage

### Exercise 2: Try Migrating Footer (30 min)

1. Find footer component
2. Check if it uses `appsConfiguration` or `appsMainConstants`
3. Follow same pattern as header:
   - Import tokens
   - Inject in constructor
   - Update template
4. Test that it works

### Exercise 3: Create Your Own Token (45 min)

Try creating a token for user preferences:

```typescript
// sites/contracts/preferences.contracts.ts
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}

// sites/tokens/preferences.tokens.ts
export const USER_PREFERENCES = new InjectionToken<UserPreferences>('user.prefs');

// apps.main/module.ts
providers: [{
  provide: USER_PREFERENCES,
  useValue: { theme: 'light', language: 'en' }
}]

// component.ts
constructor(@Inject(USER_PREFERENCES) public prefs: UserPreferences) {}
```

### Exercise 4: Write a Test (45 min)

Write a unit test for header component:

```typescript
describe('HeaderComponent', () => {
  it('should display logo from injected paths', () => {
    const mockResources = {
      logos: { light: '/test.png', dark: '/test-dark.png' },
      images: { /* ... */ },
      files: { /* ... */ }
    };
    
    TestBed.configureTestingModule({
      providers: [
        { provide: RESOURCE_PATHS, useValue: mockResources }
      ]
    });
    
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain('/test.png');
  });
});
```

---

## 📚 Additional Resources

### Documentation We Created

1. **Pattern Guide** (Comprehensive): `patterns/resource-injection-pattern.md`
2. **Migration Guide** (Quick Reference): `patterns/migration-guide-resource-injection.md`
3. **API Guide**: `patterns/quick-reference-api-injection.md`
4. **Implementation Summary**: `implementation-summary-resource-injection.md`
5. **Complete Guide** (Roadmap): `IMPLEMENTATION-COMPLETE-GUIDE.md`
6. **ADR-001** (Decision Record): `adr/ADR-001-token-based-dependency-injection.md`

### Angular Official Docs

- **Dependency Injection**: https://angular.io/guide/dependency-injection
- **InjectionToken**: https://angular.io/api/core/InjectionToken
- **Hierarchical DI**: https://angular.io/guide/hierarchical-dependency-injection

### Architecture Principles

- **SOLID Principles**: Focus on "Dependency Inversion Principle"
- **Clean Architecture**: Robert C. Martin
- **Domain-Driven Design**: Eric Evans

---

## 📋 Cheat Sheet (Quick Reference)

### Creating a New Token

```typescript
// 1. Define contract (interface)
export interface MyConfig {
  setting: string;
}

// 2. Create token
export const MY_CONFIG = new InjectionToken<MyConfig>('my.config');

// 3. Provide value
@NgModule({
  providers: [{
    provide: MY_CONFIG,
    useValue: { setting: 'value' }
  }]
})

// 4. Inject in component
constructor(@Inject(MY_CONFIG) public config: MyConfig) {}

// 5. Use in template
{{ config.setting }}
```

### Import Paths

```typescript
// From same tier
import { RESOURCE_PATHS } from '../../tokens';

// From contracts
import { ResourcePaths } from '../../contracts';

// Combined
import { RESOURCE_PATHS, ResourcePaths } from '../../tokens';
```

### Testing Pattern

```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: TOKEN, useValue: mockValue }
  ]
});
```

---

## ✅ Success Checklist

After reading this guide, you should be able to:

- [ ] Explain why direct imports are problematic
- [ ] Describe the 5-part pattern (Contract → Token → Provider → Inject → Use)
- [ ] Identify upward coupling violations
- [ ] Create a new injection token
- [ ] Provide token values in a module
- [ ] Inject tokens in components
- [ ] Use injected values in templates
- [ ] Write tests with mocked tokens
- [ ] Know where to find additional documentation

---

## 🎓 Glossary

**Dependency Injection (DI)**: Pattern where dependencies are provided to a component rather than the component creating them itself.

**Injection Token**: Angular's way of identifying what you're requesting from the DI system.

**Provider**: Configuration that tells Angular how to create or provide a dependency.

**Contract**: TypeScript interface defining the shape of data (what you're asking for).

**Upward Coupling**: Anti-pattern where lower-tier code depends on higher-tier code.

**Tier Architecture**: Organizational structure where dependencies flow downward (Core → Sites → Apps).

**Mock**: Fake implementation used for testing.

**Barrel Export**: File (usually `index.ts`) that re-exports multiple modules for cleaner imports.

---

## 💡 Pro Tips

1. **Name tokens consistently**: `RESOURCE_PATHS`, `API_ENDPOINTS` (UPPER_SNAKE_CASE)
2. **Name interfaces clearly**: `ResourcePaths`, `ApiEndpoints` (PascalCase)
3. **Document token purpose**: Add JSDoc to explain what token provides
4. **Test with mocks**: Always write tests using mocked token values
5. **Keep contracts simple**: Start with what you need, add more later
6. **Use barrel exports**: Create `index.ts` to export all tokens/contracts
7. **Follow tier rules**: Consumer defines token, provider implements it

---

**Document Created**: 2025-01-24  
**Version**: 1.0  
**For**: Team Training & Reference  
**Status**: Complete - Ready for Distribution

---

## Print This Guide

**Recommended**: Convert to PDF for offline reading
- **VS Code**: Install "Markdown PDF" extension
- **Pandoc**: `pandoc guide.md -o guide.pdf`
- **Online**: https://www.markdowntopdf.com/

**Share with**: New team members, during code reviews, in architecture discussions
