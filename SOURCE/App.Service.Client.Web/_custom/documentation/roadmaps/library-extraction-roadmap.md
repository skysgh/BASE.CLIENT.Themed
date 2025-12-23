# Strategic Roadmap: Library Extraction

## Vision
Extract `Core` and `CoreAg` into reusable Angular libraries that can be:
- Developed side-by-side in the same workspace
- Published as npm packages
- Consumed by multiple applications
- Independently versioned and tested

## Current Status
- ✅ Modules are well-structured with clear boundaries
- ✅ Services use `providedIn: 'root'` (library-friendly)
- ⚠️ **Blockers identified**: Configuration dependencies, theme coupling
- 📅 **Started**: [Date you want to add]
- 🎯 **Target**: Incremental progress between other tasks

---

## Phase 1: Prepare for Extraction
**Goal**: Remove upward dependencies and make configuration injectable

### Task Checklist

#### 1.1 Audit Dependencies
- [ ] Map all imports from Core/CoreAg to higher layers (themes, sites, apps)
- [ ] Document configuration dependencies
- [ ] Identify circular dependencies
- [ ] List third-party dependencies (peer dependencies for library)

#### 1.2 Remove Theme Coupling
- [x] ✅ **DONE** (2024): Removed `authenticationReducer` from CoreAg module
- [x] ✅ **DONE** (2024): Moved authentication state registration to AppExtension module (theme-specific)
- [x] ✅ **DONE** (2024): Verified no other theme-specific imports in Core/CoreAg

#### 1.3 Make Configuration Injectable
- [ ] Replace hardcoded `environment.custom` imports with InjectionToken
- [ ] Replace `appsConfiguration` imports with injectable config
- [ ] Replace `sitesConfiguration` imports with injectable config
- [ ] Create `forRoot()` pattern for CoreAgModule

**Example pattern to implement:**
```typescript
// Create injection token
export const CORE_CONFIG = new InjectionToken<CoreConfig>('core.config');

// forRoot() pattern
@NgModule({...})
export class CoreAgModule {
  static forRoot(config: CoreConfig): ModuleWithProviders<CoreAgModule> {
    return {
      ngModule: CoreAgModule,
      providers:
        { provide: CORE_CONFIG, useValue: config }
      ]
    };
  }
}

// Consumer usage
imports: [
  CoreAgModule.forRoot({
    apiBaseUrl: environment.custom.urls.apis.root,
    mediaUrls: environment.custom.urls.media
  })
]
```

#### 1.4 Extract Constants to Injectable Tokens
- [ ] Create `RESOURCE_URLS` injection token ⚠️ **URGENT - Logo 404s**
- [ ] Create `API_URLS` injection token
- [ ] Create `NAVIGATION_URLS` injection token
- [ ] Update services to inject tokens instead of hardcoded configs

**Current Blocker**: Sites tier components directly referencing Apps.Main resources
- Footer component: `appsConfiguration.constants.resources.open.images.logos`
- Header component: Same issue
- **Problem**: Violates tier dependency direction (upward coupling)
- **Impact**: Can't extract to library while Sites knows about Apps.Main
- **Quick Fix**: Use injection token bridge (see architectural-recovery-plan.md Phase 3.3)
- **Proper Fix**: Abstract resource paths behind service interface

**Example Fix Pattern**:
```typescript
// core/tokens/resource.tokens.ts
export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');

export interface ResourcePaths {
  logos: { light: string; dark: string };
  images: { [category: string]: string };
}

// apps.main/module.ts (provides values)
providers: [{
  provide: RESOURCE_PATHS,
  useValue: {
    logos: {
      light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
      dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
    }
  }
}]

```typescript
// sites/components/footer.ts (consumes)
constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
```

**Files to update:**
- `src/core/services/repositories/base/mapped-generic-repository.service.base.ts`
- `src/sites/constants/implementations/*.ts`
- `src/apps/constants/implementations/*.ts`

---

## Phase 2: Create Angular Workspace Libraries
**Goal**: Set up library infrastructure within existing workspace

### Task Checklist

#### 2.1 Generate Library Projects
```bash
ng generate library @base/core --prefix=base-core
ng generate library @base/core-ag --prefix=base-ag
```

- [ ] Create `@base/core` library
- [ ] Create `@base/core-ag` library
- [ ] Configure library build in `angular.json`
- [ ] Set up proper peer dependencies in library `package.json`

#### 2.2 Configure Library Exports
- [ ] Define public API in `public-api.ts`
- [ ] Export only necessary interfaces/classes
- [ ] Document exported APIs
- [ ] Add TSDoc comments

#### 2.3 Update Path Mappings
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@base/core": ["projects/@base/core/src/public-api"],
      "@base/core-ag": ["projects/@base/core-ag/src/public-api"]
    }
  }
}
```

- [ ] Add path mappings to `tsconfig.json`
- [ ] Verify imports resolve correctly

---

## Phase 3: Gradual Migration
**Goal**: Move code incrementally without breaking existing app

### Migration Strategy
**Principle**: "Strangler Fig Pattern" - wrap old code, migrate piece by piece

#### 3.1 Services Migration (Priority Order)
1. [ ] **Utility services** (no dependencies):
   - `StringService`
   - `TypeService`
   - `ArrayService`
   - `UrlService`

2. [ ] **Infrastructure services**:
   - `SystemDiagnosticsTraceService`
   - `SystemErrorService`
   - `SessionStorageService`

3. [ ] **Repository base classes**:
   - `MappedGenericRepositoryServiceBase`
   - `SimpleGenericRepositoryServiceBase`

4. [ ] **Domain services**:
   - Feature-specific services

#### 3.2 Components Migration
- [ ] Move common components to `@base/core-ag`
- [ ] Update imports in consuming modules
- [ ] Test components in isolation

#### 3.3 Interceptors & Guards
- [ ] Move HTTP interceptors to library
- [ ] Move route guards to library
- [ ] Make them configurable via forRoot()

#### 3.4 Pipes & Directives
- [ ] Move reusable pipes to library
- [ ] Move reusable directives to library
- [ ] Export via module

---

## Phase 4: Polish & Publish
**Goal**: Prepare libraries for production use

### Task Checklist

#### 4.1 Documentation
- [ ] Create README for each library
- [ ] Document configuration options
- [ ] Add usage examples
- [ ] Create migration guide

#### 4.2 Testing
- [ ] Set up Jest/Karma for library testing
- [ ] Add unit tests for services
- [ ] Add integration tests
- [ ] Achieve >80% code coverage

#### 4.3 Build & Release
- [ ] Configure library build scripts
- [ ] Set up versioning (semantic versioning)
- [ ] Configure npm package metadata
- [ ] Choose registry (npm, GitHub Packages, private registry)

#### 4.4 CI/CD
- [ ] Set up automated builds
- [ ] Set up automated tests
- [ ] Set up automated publishing
- [ ] Version bump automation

---

## Incremental Tasks (Do Between Other Work)

### Quick Wins (< 30 min each)
- [x] ✅ Remove theme dependency from CoreAg module
- [ ] Add JSDoc comments to 5 core services
- [ ] Create InjectionToken for one config value
- [ ] Write unit test for one utility service
- [ ] Document one service's API

### Medium Tasks (1-2 hours)
- [ ] Refactor one service to use injectable config
- [ ] Move one utility service to library
- [ ] Create forRoot() pattern for one module
- [ ] Migrate one component to library

### Large Tasks (half day+)
- [ ] Complete Phase 1.3 (Make Configuration Injectable)
- [ ] Set up library projects (Phase 2.1)
- [ ] Migrate all utility services (Phase 3.1.1)

---

## Success Criteria

### Phase 1 Complete When:
- ✅ No imports from Core/CoreAg to themes/sites/apps
- ✅ All configuration is injectable
- ✅ Services work without environment imports

### Phase 2 Complete When:
- ✅ Library projects build successfully
- ✅ Main app can import from `@base/core` paths
- ✅ Hot reload works for library changes

### Phase 3 Complete When:
- ✅ All Core services moved to library
- ✅ All CoreAg components/directives/pipes moved
- ✅ Main app uses library imports exclusively

### Phase 4 Complete When:
- ✅ Libraries published to registry
- ✅ Documentation complete
- ✅ Test coverage >80%
- ✅ Can create new app and consume libraries

---

## Benefits Tracking

### Current State
- Tight coupling to themes/sites/apps
- Hard to reuse across projects
- Testing requires full app context

### Target State
- Standalone libraries
- npm installable
- Fully tested in isolation
- Used by multiple projects
- Documented APIs

---

## Notes & Decisions

### Decision Log
- **2024-XX-XX**: Decided on Angular workspace libraries over external repos
- **2024-XX-XX**: Chose InjectionToken pattern for configuration
- **2024-XX-XX**: Removed theme dependency from CoreAg module

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Breaking changes during migration | Use Strangler Fig pattern, gradual migration |
| Configuration complexity | Document well, provide defaults |
| Testing overhead | Start with most stable services |
| Time investment | Do incrementally between other tasks |

---

## Quick Reference Commands

```bash
# Build libraries
ng build @base/core
ng build @base/core-ag

# Watch for changes during development
ng build @base/core --watch
ng build @base/core-ag --watch

# Test libraries
ng test @base/core
ng test @base/core-ag

# Publish to npm
npm publish dist/base/core
npm publish dist/base/core-ag

# Link locally for testing
cd dist/base/core && npm link
cd ../../../ && npm link @base/core
```

---

## Related Documentation
- [Environment IntelliSense Guide](_custom/documentation/angular/HowTo/environment-intellisense.md)
- [Module Structure Guide](_custom/documentation/angular/Understand/elements-module.md)
- Angular Library Guide: https://angular.io/guide/creating-libraries
- Injection Tokens: https://angular.io/guide/dependency-injection-providers#using-an-injectiontoken-object

---

**Last Updated**: [Current Date]  
**Status**: 🟡 In Progress - Phase 1.2  
**Next Action**: Remove remaining theme dependencies
