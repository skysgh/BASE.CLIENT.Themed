# ADR-001: Token-Based Dependency Injection for Cross-Tier Configuration

**Status**: Accepted  
**Date**: 2025-01-24  
**Deciders**: Architecture Team  
**Technical Story**: Eliminate upward tier coupling in Angular application

---

## Context and Problem Statement

The application has a tiered architecture (Core → Core.Ag → Themes → Sites → Apps → Apps.Main) where dependencies should flow downward. However, many components in lower tiers (Sites, Applets) directly import constants and configuration from higher tiers (Apps.Main), creating upward coupling.

**Example of the Problem**:
```typescript
// sites/components/header/component.ts
import { appsMainConstants } from 'apps.main/constants'; // ❌ UPWARD COUPLING
import { appsConfiguration } from 'apps/configuration';  // ❌ UPWARD COUPLING

export class HeaderComponent {
  public appsMainConstants = appsMainConstants;
  public appsConfiguration = appsConfiguration;
}
```

**Consequences**:
- Violates tier architecture principles
- Blocks library extraction (Sites can't be standalone)
- Makes testing difficult (can't mock hardcoded imports)
- Creates circular dependency risks
- Reduces flexibility (can't swap implementations)

---

## Decision Drivers

1. **Architectural Integrity**: Maintain correct dependency flow (downward only)
2. **Testability**: Enable unit testing with mocked dependencies
3. **Flexibility**: Allow environment-specific or runtime configuration swapping
4. **Library Extraction**: Enable future extraction of tiers as reusable packages
5. **CLI Safety**: Avoid placing code in CLI-managed directories
6. **Developer Experience**: Preserve TypeScript autocomplete
7. **Performance**: Zero or negligible runtime overhead
8. **Migration Path**: Incremental adoption without breaking existing code

---

## Considered Options

### Option 1: Service Abstraction Layer
Abstract services provide configuration:
```typescript
@Injectable()
export class ResourceConfigService {
  getLogoPath(): string { return '/assets/logos/logo.png'; }
}
```

**Pros**:
- Very flexible (can add logic)
- Standard Angular pattern

**Cons**:
- More boilerplate (service + interface + provider)
- Overkill for simple paths
- More indirection

### Option 2: Environment Files
Put paths in `environment.ts`:
```typescript
export const environment = {
  logoPath: '/assets/logos/logo.png'
};
```

**Pros**:
- Simple
- Build-time replacement

**Cons**:
- Global scope (not tier-specific)
- Can't be swapped at runtime
- No TypeScript autocomplete for nested paths

### Option 3: Direct Imports with Barrel Files
Use barrel exports to control visibility:
```typescript
// apps.main/public-api.ts
export { resourcePaths } from './constants';
```

**Pros**:
- Simple
- TypeScript-native

**Cons**:
- Still creates upward coupling
- Doesn't solve library extraction
- Hard to test

### Option 4: Injection Tokens (CHOSEN)
Use Angular DI with injection tokens:
```typescript
// sites/contracts/resource.contracts.ts
export interface ResourcePaths { logos: { light: string; dark: string } }

// sites/tokens/resource.tokens.ts
export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');

// apps.main/module.ts
providers: [{ provide: RESOURCE_PATHS, useValue: { logos: {...} } }]

// sites/components/header/component.ts
constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
```

**Pros**:
- Follows Angular best practices
- Testable (mock token in tests)
- Flexible (swap implementations)
- Maintains tier boundaries
- TypeScript autocomplete preserved
- Zero runtime overhead
- Incremental migration

**Cons**:
- Initial setup overhead
- More files (contracts + tokens)
- Requires understanding DI

---

## Decision Outcome

**Chosen option**: Option 4 (Injection Tokens)

**Rationale**: Best balance of architectural correctness, testability, flexibility, and developer experience. Aligns with Angular framework philosophy while solving the specific problem of tier coupling.

### Positive Consequences

1. **Architectural Compliance**
   - Sites defines what it needs (contracts)
   - Apps.Main provides implementations
   - No upward dependencies

2. **Library Extraction Enabled**
   - Sites can be extracted with its contracts
   - Different apps can provide different implementations
   - Core remains framework-agnostic

3. **Testability Achieved**
   ```typescript
   TestBed.configureTestingModule({
     providers: [
       { provide: RESOURCE_PATHS, useValue: mockResources }
     ]
   });
   ```

4. **Flexibility Gained**
   - Swap implementations per environment
   - Runtime configuration
   - A/B testing support

5. **Developer Experience Maintained**
   - TypeScript autocomplete works
   - Clear error messages
   - Familiar Angular pattern

### Negative Consequences

1. **Initial Learning Curve**
   - Team needs to understand DI pattern
   - Migration documentation required
   - Code review process update

2. **More Files**
   - Contracts directory
   - Tokens directory
   - Provider configuration

3. **Verbose Constructor Injection**
   ```typescript
   constructor(
     @Inject(RESOURCE_PATHS) resources: ResourcePaths,
     @Inject(API_ENDPOINTS) apis: ApiEndpoints,
     @Inject(NAVIGATION_PATHS) navigation: NavigationPaths
   ) {}
   ```

4. **Cannot Use in Base Classes** (Limitation)
   - Repository services pass URLs in constructor
   - Need factory pattern or property injection
   - Documented as technical debt

---

## Implementation

### Token Placement Strategy

**Rule**: Each tier defines contracts for what IT needs to consume.

| Tier | Defines | Provides | Consumes | Rationale |
|------|---------|----------|----------|-----------|
| Core | ❌ None | ❌ None | ❌ None | Framework-agnostic |
| Core.Ag | ⚠️ Framework | ❌ None | ❌ None | Angular adapters only |
| Themes | ⚠️ Theme | ⚠️ Theme | ⚠️ Theme | Theme-specific |
| **Sites** | ✅ **App** | ❌ None | ✅ **App** | **Consumer ownership** |
| Apps | ❌ None | ❌ None | ❌ None | Coordination layer |
| Apps.Main | ❌ None | ✅ **All** | ❌ None | **Root provider** |
| Applets | ✅ Applet | ❌ None | ✅ Applet | Vertical slices |

**Key Insight**: Sites defines tokens for app-level concerns because Sites components consume them. Apps.Main provides the values.

### File Structure

```
sites/
├── contracts/              # TypeScript interfaces
│   ├── resource.contracts.ts
│   ├── api.contracts.ts
│   ├── navigation.contracts.ts
│   └── index.ts
├── tokens/                 # Angular injection tokens
│   ├── resource.tokens.ts
│   ├── api.tokens.ts
│   ├── navigation.tokens.ts
│   └── index.ts
└── components/
    └── header/
        ├── component.ts    # Injects tokens
        └── component.html  # Uses injected properties

apps.main/
└── module.ts               # Provides token values
```

### Migration Pattern

**Step 1**: Create contract in Sites
```typescript
// sites/contracts/resource.contracts.ts
export interface ResourcePaths {
  logos: { light: string; dark: string };
}
```

**Step 2**: Create token in Sites
```typescript
// sites/tokens/resource.tokens.ts
import { InjectionToken } from '@angular/core';
import { ResourcePaths } from '../contracts';

export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');
```

**Step 3**: Provide in Apps.Main
```typescript
// apps.main/module.ts
import { RESOURCE_PATHS } from '../sites/tokens';

@NgModule({
  providers: [{
    provide: RESOURCE_PATHS,
    useValue: { logos: { light: '...', dark: '...' } }
  }]
})
```

**Step 4**: Inject in component
```typescript
// sites/components/header/component.ts
import { RESOURCE_PATHS, ResourcePaths } from '../../tokens';

constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
```

**Step 5**: Use in template
```html
<!-- sites/components/header/component.html -->
<img [src]="resources.logos.light">
```

---

## Compliance and Enforcement

### Code Review Checklist

**Reject** pull requests with:
- [ ] Sites importing from Apps.Main
- [ ] Sites importing from Apps
- [ ] Core importing from @angular/*
- [ ] Hardcoded resource paths in components
- [ ] Hardcoded API URLs in components
- [ ] Hardcoded navigation URLs in templates

**Approve** pull requests with:
- [x] Token injection in constructors
- [x] Contracts defined in consuming tier
- [x] Providers in Apps.Main module
- [x] Comprehensive tests with mocked tokens

### Automated Enforcement (To Do)

**ESLint Rule 1**: No upward tier imports
```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "zones": [{
        "target": "./src/sites/**/*",
        "from": "./src/apps.main/**/*",
        "message": "Sites cannot import from Apps.Main. Use DI tokens instead."
      }]
    }]
  }
}
```

**ESLint Rule 2**: No Angular in Core
```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "zones": [{
        "target": "./src/core/**/*",
        "from": "@angular/**/*",
        "message": "Core must be framework-agnostic."
      }]
    }]
  }
}
```

### Documentation Requirements

When creating new tokens:
1. Document rationale in token file
2. Add usage example in JSDoc
3. Update migration guide
4. Create unit test example
5. Update this ADR if pattern changes

---

## Alternatives After Decision

If this pattern proves problematic, consider:

### Fallback 1: Hybrid Approach
Keep tokens for testability, add services for complex logic:
```typescript
@Injectable()
export class ResourceService {
  constructor(@Inject(RESOURCE_PATHS) private paths: ResourcePaths) {}
  
  getOptimizedLogoPath(theme: 'light' | 'dark'): string {
    // Add logic here
    return theme === 'light' ? this.paths.logos.light : this.paths.logos.dark;
  }
}
```

### Fallback 2: Facade Pattern
Single service provides all configuration:
```typescript
@Injectable()
export class AppConfigFacade {
  constructor(
    @Inject(RESOURCE_PATHS) public resources: ResourcePaths,
    @Inject(API_ENDPOINTS) public apis: ApiEndpoints,
    @Inject(NAVIGATION_PATHS) public navigation: NavigationPaths
  ) {}
}

// Components inject one service instead of three tokens:
constructor(public config: AppConfigFacade) {}
```

---

## Related Decisions

- ADR-002: (Pending) Core Library Extraction Strategy
- ADR-003: (Pending) Constants Consolidation Plan
- ADR-004: (Pending) Repository Service Refactoring

---

## Notes

### Performance Impact
- Token resolution: O(1) at component creation
- Memory overhead: Negligible (single instance per token)
- Bundle size: No impact (tree-shakeable)

### Browser Compatibility
- Works in all browsers supporting Angular
- No polyfills required

### Team Feedback
- Initial learning curve expected
- Documentation critical for adoption
- Pair programming recommended for first migrations

---

## References

- **Angular DI Guide**: https://angular.io/guide/dependency-injection
- **InjectionToken API**: https://angular.io/api/core/InjectionToken
- **Clean Architecture**: Robert C. Martin
- **SOLID Principles**: Dependency Inversion Principle

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-24 | Initial decision | Architecture Team |

---

**Status**: Accepted and Implemented  
**Next Review**: 2025-02-24 (1 month)  
**Success Criteria**: 80% component coverage, zero upward dependencies
