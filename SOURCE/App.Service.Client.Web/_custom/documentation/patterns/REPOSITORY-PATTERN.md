# 🏗️ Modern Repository Pattern

**Status:** ✅ Active (Phase 2 Complete)  
**Last Updated:** 2025-12-28  
**Pattern Version:** 2.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pattern Architecture](#pattern-architecture)
3. [Before & After](#before--after)
4. [Layer Breakdown](#layer-breakdown)
5. [Migration Guide](#migration-guide)
6. [Testing Strategy](#testing-strategy)
7. [Best Practices](#best-practices)
8. [Common Pitfalls](#common-pitfalls)
9. [Examples](#examples)

---

## 🎯 Overview

### **What Changed?**

We migrated from **inheritance-based repositories** to **composition + signals pattern**.

**OLD Pattern:**
- Complex inheritance chains (3-4 levels deep)
- Tight coupling between layers
- Hard to test
- Manual subscription management
- Polluted base classes

**NEW Pattern:**
- Clean composition (no inheritance chains!)
- Pure functions for mapping
- Angular signals (automatic reactivity)
- Easy to test
- Single responsibility principle

### **Benefits**

✅ **Simpler:** No inheritance chains to understand  
✅ **Testable:** Pure functions and dependency injection  
✅ **Maintainable:** Clear separation of concerns  
✅ **Modern:** Uses Angular 17+ signals  
✅ **Type-Safe:** Full TypeScript support  
✅ **Reactive:** Signals handle change detection automatically

---

## 🏛️ Pattern Architecture

```
┌─────────────────────────────────────────────────────┐
│                   COMPONENT                         │
│  • Injects Service                                  │
│  • Reads Signals (no subscriptions!)               │
│  • Displays ViewModels                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                    SERVICE                          │
│  • Business Logic                                   │
│  • State Management (Signals)                       │
│  • Computed Values                                  │
│  • Uses Repository + Mapper                         │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   REPOSITORY     │    │     MAPPER       │
│  • HTTP Calls    │    │  • Pure Functions│
│  • CRUD Ops      │    │  • DTO ↔ VM      │
│  • Query Methods │    │  • Type Safe     │
└────────┬─────────┘    └──────────────────┘
         │
         ▼
┌──────────────────┐
│       API        │
│  • REST Endpoint │
│  • JSON Response │
└──────────────────┘
```

### **Data Flow**

```
API Response (JSON)
  ↓
DTO (ServiceFeatureDto) ← Repository receives
  ↓
ViewModel (ServiceFeatureViewModel) ← Mapper transforms
  ↓
Signal (features()) ← Service stores
  ↓
Template Display ← Component consumes
```

---

## 🔄 Before & After

### **Old Pattern (Inheritance Hell)**

```typescript
// OLD: Complex inheritance chain
export class ServiceFeaturesService
  extends MappedItemsCollectionServiceBase<ServiceFeature, string, ServiceFeature> {
  
  // Inherits 500+ lines from base class
  // Tight coupling to base implementation
  // Hard to understand data flow
  // Manual subscription management
  
  protected override ServiceSpecificImplementationToFilterFor(item: ServiceFeature): boolean {
    return true;
  }
  
  protected override ServiceSpecificImplementationToDevelopMappedObject(item: ServiceFeature): ServiceFeature {
    return item;
  }
  
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<ServiceFeature[]> {
    return this.repository.getPage();
  }
}

// Component usage:
export class MyComponent {
  public features$: Observable<ServiceFeature[]> = of([]);
  
  constructor(private featureService: ServiceFeaturesService) {
    this._fetchData();
  }
  
  private _fetchData() {
    this.features$ = this.featureService.items$; // Observable subscription
  }
}
```

**Template:**
```html
<div *ngIf="features$ | async as features">
  <div *ngFor="let feature of features">
    {{ feature.title }}
  </div>
</div>
```

### **New Pattern (Clean Composition)**

```typescript
// NEW: Simple service with signals
@Injectable({ providedIn: 'root' })
export class ServiceFeatureService {
  // Signals (reactive state)
  readonly features = signal<ServiceFeatureViewModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  
  // Computed (auto-updating)
  readonly enabledFeatures = computed(() => 
    this.features().filter(f => f.isEnabled)
  );
  
  constructor(
    private repository: ServiceFeatureRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.loadFeatures();
  }
  
  loadFeatures(): Observable<ServiceFeatureViewModel[]> {
    this.loading.set(true);
    
    return this.repository.getAll().pipe(
      map(dtos => mapServiceFeatureDtosToViewModels(dtos)),
      tap(vms => {
        this.features.set(vms);
        this.loading.set(false);
      })
    );
  }
}

// Component usage:
export class MyComponent {
  constructor(public featureService: ServiceFeatureService) {}
  // That's it! No subscriptions needed!
}
```

**Template:**
```html
<div>
  <div *ngFor="let feature of featureService.enabledFeatures()">
    {{ feature.title }}
  </div>
  <p>Total: {{ featureService.totalCount() }}</p>
</div>
```

---

## 📦 Layer Breakdown

### **1. DTO (Data Transfer Object)**

**Purpose:** Define exact API contract

**Location:** `src/core/models/dtos/`

**Example:**
```typescript
// service-feature.dto.ts
export interface ServiceFeatureDto {
  id: string;
  serviceId: string;
  enabled: boolean;        // Server naming
  title: string;
  description: string;
  imageId?: string;
}
```

**Characteristics:**
- ✅ Matches API response 1:1
- ✅ Server-side naming conventions
- ✅ Includes all database fields
- ❌ Not used directly in templates
- ❌ No computed properties

---

### **2. ViewModel**

**Purpose:** UI-friendly data structure

**Location:** `src/core/models/view-models/`

**Example:**
```typescript
// service-feature.view-model.ts
export interface ServiceFeatureViewModel {
  id: string;
  serviceId: string;
  isEnabled: boolean;      // UI-friendly naming
  title: string;
  description: string;
  imageUrl: string;        // Computed from imageId
  cssClass?: string;       // Added for presentation
}
```

**Characteristics:**
- ✅ UI-friendly naming (isEnabled vs enabled)
- ✅ Computed fields (imageUrl from imageId)
- ✅ Presentation-specific fields (cssClass)
- ✅ Used directly in templates
- ❌ Never sent to API

---

### **3. Mapper (Pure Functions)**

**Purpose:** Transform between DTO ↔ ViewModel

**Location:** `src/core/mappers/`

**Example:**
```typescript
// service-feature.mapper.ts
export function mapServiceFeatureDtoToViewModel(dto: ServiceFeatureDto): ServiceFeatureViewModel {
  return {
    id: dto.id,
    serviceId: dto.serviceId,
    isEnabled: dto.enabled,           // Rename
    title: dto.title,
    description: dto.description,
    imageUrl: resolveImageUrl(dto.imageId),  // Compute
    cssClass: generateCssClass(dto)          // Add
  };
}

export function mapServiceFeatureViewModelToDto(vm: ServiceFeatureViewModel): Partial<ServiceFeatureDto> {
  return {
    id: vm.id,
    serviceId: vm.serviceId,
    enabled: vm.isEnabled,            // Reverse rename
    title: vm.title,
    description: vm.description,
    imageId: extractImageIdFromUrl(vm.imageUrl)  // Reverse compute
  };
}
```

**Characteristics:**
- ✅ Pure functions (no side effects)
- ✅ Easy to test
- ✅ Type-safe transformations
- ✅ Bidirectional mapping
- ❌ No business logic
- ❌ No state

---

### **4. Repository**

**Purpose:** Data access layer (HTTP operations)

**Location:** `src/core/repositories/`

**Example:**
```typescript
// service-feature.repository.ts
@Injectable({ providedIn: 'root' })
export class ServiceFeatureRepository extends RepositoryService<ServiceFeatureDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/base_service_Features', logger, errorService);
  }

  // Custom query methods
  getEnabled(): Observable<ServiceFeatureDto[]> {
    return this.query({ enabled: true });
  }

  getByServiceId(serviceId: string): Observable<ServiceFeatureDto[]> {
    return this.query({ serviceId });
  }
}
```

**Characteristics:**
- ✅ Extends generic RepositoryService
- ✅ Handles HTTP operations
- ✅ Returns DTOs (not ViewModels)
- ✅ Custom query methods allowed
- ❌ No business logic
- ❌ No state management

---

### **5. Service (Business Logic + State)**

**Purpose:** Business logic and state management

**Location:** `src/core/services/`

**Example:**
```typescript
// service-feature.service.ts
@Injectable({ providedIn: 'root' })
export class ServiceFeatureService {
  // Signals
  readonly features = signal<ServiceFeatureViewModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  
  // Computed
  readonly enabledFeatures = computed(() => 
    this.features().filter(f => f.isEnabled)
  );
  
  readonly totalCount = computed(() => this.features().length);
  
  constructor(
    private repository: ServiceFeatureRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.loadFeatures();
  }
  
  loadFeatures(): Observable<ServiceFeatureViewModel[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      map(dtos => mapServiceFeatureDtosToViewModels(dtos)),
      tap(vms => {
        this.features.set(vms);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to load features');
        this.loading.set(false);
        return of([]);
      })
    );
  }
}
```

**Characteristics:**
- ✅ Uses signals for state
- ✅ Computed values auto-update
- ✅ Business logic lives here
- ✅ Coordinates Repository + Mapper
- ❌ Never does HTTP directly
- ❌ Never knows about DTOs in public API

---

### **6. Component**

**Purpose:** UI presentation and user interaction

**Location:** `src/*/features/*/components/`

**Example:**
```typescript
// feature-list.component.ts
@Component({
  selector: 'app-feature-list',
  template: `
    <div *ngIf="featureService.loading()">Loading...</div>
    <div *ngIf="featureService.hasError()">{{ featureService.error() }}</div>
    
    <div *ngFor="let feature of featureService.enabledFeatures()">
      <h3>{{ feature.title }}</h3>
      <p>{{ feature.description }}</p>
      <img [src]="feature.imageUrl" />
    </div>
    
    <p>Total: {{ featureService.totalCount() }}</p>
  `
})
export class FeatureListComponent {
  constructor(public featureService: ServiceFeatureService) {}
  // No subscriptions! Signals handle everything!
}
```

**Characteristics:**
- ✅ Injects service
- ✅ Uses signals directly in template
- ✅ No manual subscriptions
- ✅ No OnDestroy needed
- ❌ No business logic
- ❌ No HTTP calls

---

## 🚀 Migration Guide

### **Step 1: Create _removed Folders**

```bash
src/core/_removed/
src/core.ag/_removed/
src/themes/t1/_removed/
src/sites.anon/_removed/
src/sites.app/_removed/
```

### **Step 2: Create New Folder Structure**

```bash
src/core/
├── repositories/
│   ├── base/
│   │   └── repository.service.ts
│   └── [entity].repository.ts
├── mappers/
│   └── [entity].mapper.ts
├── models/
│   ├── dtos/
│   │   └── [entity].dto.ts
│   └── view-models/
│       └── [entity].view-model.ts
└── services/
    └── [entity].service.ts
```

### **Step 3: Migrate One Service**

For each service (e.g., `ServiceFeaturesService`):

1. **Create DTO** (`service-feature.dto.ts`)
2. **Create ViewModel** (`service-feature.view-model.ts`)
3. **Create Mapper** (`service-feature.mapper.ts`)
4. **Create Repository** (`service-feature.repository.ts`)
5. **Create Service** (`service-feature.service.ts`)
6. **Update Components** (use new service)
7. **Write Tests** (all layers)
8. **Move Old Files** to `_removed/`

### **Step 4: Test Thoroughly**

```bash
# Run tests
npm run test

# Run critical tests
npm run test:critical

# Generate coverage report
npm run test:report
```

### **Step 5: Document**

Update `REPOSITORY-MIGRATION-STATUS.md` with progress.

---

## 🧪 Testing Strategy

### **1. Mapper Tests**

```typescript
describe('ServiceFeature Mapper', () => {
  it('should map DTO to ViewModel', () => {
    const dto: ServiceFeatureDto = {
      id: '1',
      enabled: true,
      title: 'Test'
    };
    
    const vm = mapServiceFeatureDtoToViewModel(dto);
    
    expect(vm.isEnabled).toBe(true);
    expect(vm.imageUrl).toBeDefined();
  });
});
```

### **2. Repository Tests**

```typescript
describe('ServiceFeatureRepository', () => {
  let repository: ServiceFeatureRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceFeatureRepository]
    });
    
    repository = TestBed.inject(ServiceFeatureRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get all features', (done) => {
    repository.getAll().subscribe(features => {
      expect(features.length).toBe(2);
      done();
    });

    const req = httpMock.expectOne('/api/base_service_Features');
    req.flush(mockDtos);
  });
});
```

### **3. Service Tests**

```typescript
describe('ServiceFeatureService', () => {
  let service: ServiceFeatureService;
  let repositorySpy: jasmine.SpyObj<ServiceFeatureRepository>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ServiceFeatureRepository', ['getAll']);
    
    TestBed.configureTestingModule({
      providers: [
        ServiceFeatureService,
        { provide: ServiceFeatureRepository, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ServiceFeatureService);
    repositorySpy = TestBed.inject(ServiceFeatureRepository) as jasmine.SpyObj<ServiceFeatureRepository>;
  });

  it('should load features into signal', (done) => {
    repositorySpy.getAll.and.returnValue(of(mockDtos));
    
    service.loadFeatures().subscribe(() => {
      expect(service.features().length).toBe(2);
      expect(service.loading()).toBe(false);
      done();
    });
  });

  it('should compute enabled features', () => {
    service.features.set(mockViewModels);
    
    const enabled = service.enabledFeatures();
    
    expect(enabled.length).toBe(1);
    expect(enabled.every(f => f.isEnabled)).toBe(true);
  });
});
```

### **4. Component Tests**

```typescript
describe('FeatureListComponent', () => {
  let component: FeatureListComponent;
  let fixture: ComponentFixture<FeatureListComponent>;
  let service: ServiceFeatureService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureListComponent],
      providers: [ServiceFeatureService]
    }).compileComponents();
    
    fixture = TestBed.createComponent(FeatureListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceFeatureService);
  });

  it('should display features from signal', () => {
    service.features.set(mockViewModels);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Feature 1');
  });
});
```

---

## ✅ Best Practices

### **DO:**

1. ✅ **Keep DTOs aligned with API:**
   ```typescript
   // Match API response exactly
   export interface ServiceFeatureDto {
     enabled: boolean;  // Match server naming
   }
   ```

2. ✅ **Use UI-friendly naming in ViewModels:**
   ```typescript
   // UI-friendly naming
   export interface ServiceFeatureViewModel {
     isEnabled: boolean;  // Clearer in templates
   }
   ```

3. ✅ **Keep mappers pure:**
   ```typescript
   // No side effects, just transformation
   export function mapDto(dto: Dto): ViewModel {
     return { /* pure transformation */ };
   }
   ```

4. ✅ **Use signals for state:**
   ```typescript
   readonly features = signal<ViewModel[]>([]);
   readonly loading = signal(false);
   ```

5. ✅ **Use computed for derived values:**
   ```typescript
   readonly enabledFeatures = computed(() => 
     this.features().filter(f => f.isEnabled)
   );
   ```

6. ✅ **Test each layer independently:**
   - Mapper: Pure function tests
   - Repository: HTTP mock tests
   - Service: Spy tests
   - Component: Template tests

### **DON'T:**

1. ❌ **Don't mix DTOs and ViewModels:**
   ```typescript
   // BAD: Using DTO in template
   <div *ngFor="let feature of features()">
     {{ feature.enabled }}  <!-- Server naming in UI! -->
   </div>
   
   // GOOD: Using ViewModel in template
   <div *ngFor="let feature of features()">
     {{ feature.isEnabled }}  <!-- UI-friendly naming -->
   </div>
   ```

2. ❌ **Don't put business logic in mappers:**
   ```typescript
   // BAD: Business logic in mapper
   function mapDto(dto: Dto): ViewModel {
     if (someComplexCondition()) {  // NO!
       // Business logic
     }
   }
   
   // GOOD: Pure transformation only
   function mapDto(dto: Dto): ViewModel {
     return { ...dto };  // Simple transformation
   }
   ```

3. ❌ **Don't do HTTP in services:**
   ```typescript
   // BAD: HTTP in service
   loadFeatures() {
     this.http.get('/api/features').subscribe(...);
   }
   
   // GOOD: Use repository
   loadFeatures() {
     this.repository.getAll()
       .pipe(map(mapDtos))
       .subscribe(...);
   }
   ```

4. ❌ **Don't use observables for state:**
   ```typescript
   // BAD: Observable state
   public features$: Observable<ViewModel[]>;
   
   // GOOD: Signal state
   readonly features = signal<ViewModel[]>([]);
   ```

5. ❌ **Don't keep old pattern and new pattern:**
   - Move old files to `_removed/`
   - Don't mix patterns in same service
   - Complete migration per service

---

## ⚠️ Common Pitfalls

### **1. Forgetting to Import Mapper**

```typescript
// ERROR: Undefined function
loadFeatures() {
  return this.repository.getAll().pipe(
    map(mapServiceFeatureDtoToViewModel)  // ❌ Not imported!
  );
}

// FIX: Import mapper
import { mapServiceFeatureDtoToViewModel } from '../mappers/service-feature.mapper';
```

### **2. Using DTO in Template**

```typescript
// ERROR: Using DTO naming in template
<div *ngFor="let feature of features()">
  {{ feature.enabled }}  <!-- ❌ DTO field! -->
</div>

// FIX: Use ViewModel
<div *ngFor="let feature of features()">
  {{ feature.isEnabled }}  <!-- ✅ ViewModel field! -->
</div>
```

### **3. Not Updating Signal**

```typescript
// ERROR: Observable return without signal update
loadFeatures(): Observable<ViewModel[]> {
  return this.repository.getAll().pipe(
    map(mapDtos)
    // ❌ No tap() to update signal!
  );
}

// FIX: Update signal
loadFeatures(): Observable<ViewModel[]> {
  return this.repository.getAll().pipe(
    map(mapDtos),
    tap(vms => this.features.set(vms))  // ✅ Update signal!
  );
}
```

### **4. Manual Subscriptions**

```typescript
// ERROR: Manual subscription in component
ngOnInit() {
  this.featureService.features$.subscribe(features => {
    this.features = features;  // ❌ Manual subscription!
  });
}

// FIX: Use signals directly
// No ngOnInit needed!
// Template: {{ featureService.features() | json }}
```

### **5. Forgetting Error Handling**

```typescript
// ERROR: No error handling
loadFeatures() {
  return this.repository.getAll().pipe(
    map(mapDtos),
    tap(vms => this.features.set(vms))
    // ❌ No catchError!
  );
}

// FIX: Add error handling
loadFeatures() {
  return this.repository.getAll().pipe(
    map(mapDtos),
    tap(vms => this.features.set(vms)),
    catchError(err => {  // ✅ Handle errors!
      this.error.set('Failed to load');
      return of([]);
    })
  );
}
```

---

## 📚 Examples

### **Complete Service Implementation**

See migrated `ServiceFeatureService`:
- DTO: `src/core/models/dtos/service-feature.dto.ts`
- ViewModel: `src/core/models/view-models/service-feature.view-model.ts`
- Mapper: `src/core/mappers/service-feature.mapper.ts`
- Repository: `src/core/repositories/service-feature.repository.ts`
- Service: `src/core/services/service-feature.service.ts`
- Tests: `*.spec.ts` files

### **Component Usage**

See updated component:
- Component: `src/sites.anon/features/pages/landing/_sharedparts/components/designed/component.ts`
- Template: `component.html`

---

## 📊 Migration Status

Track migration progress in:
`_custom/documentation/patterns/REPOSITORY-MIGRATION-STATUS.md`

---

## 🎯 Next Steps

1. **Migrate remaining services** using this pattern
2. **Remove old base classes** once all services migrated
3. **Update documentation** as patterns evolve
4. **Share learnings** with team

---

## 💡 Questions?

If pattern unclear:
1. Review this document
2. Check migrated `ServiceFeatureService` example
3. Review tests for implementation details
4. Update documentation with learnings

---

**Last Updated:** 2025-12-28  
**Status:** ✅ Pattern Established  
**Example Service:** ServiceFeatureService (Complete)
