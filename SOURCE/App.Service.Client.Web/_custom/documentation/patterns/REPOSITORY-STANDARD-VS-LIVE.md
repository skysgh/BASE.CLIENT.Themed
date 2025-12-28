# 🔄 Repository Patterns: Standard vs Live

**Last Updated:** 2025-12-28  
**Status:** ✅ Both Patterns Available

---

## 📋 Overview

We provide **two repository patterns** to handle different data synchronization needs:

1. **Standard Repository** - One-shot data fetching
2. **Live Repository** - Auto-updating data with polling

---

## 🎯 When to Use Each Pattern

### **Standard Repository (`RepositoryService<T>`)**

**Use When:**
- ✅ Data is relatively static (reference data)
- ✅ User initiates data refresh (CRUD operations)
- ✅ One-time data fetch is sufficient
- ✅ Performance is critical (no background polling)
- ✅ Data changes only through user actions

**Examples:**
- Service features list
- Product catalog
- User profiles
- Settings/configuration
- Form reference data (countries, states, etc.)

**Code:**
```typescript
@Injectable({ providedIn: 'root' })
export class ProductRepository extends RepositoryService<ProductDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/products', logger);
  }
}

// Usage - One-shot fetch
products$ = this.productRepo.getAll();
```

---

### **Live Repository (`LiveRepositoryService<T>`)**

**Use When:**
- ✅ Data changes frequently on server
- ✅ Real-time updates are important
- ✅ Multiple users might modify data
- ✅ Dashboard/monitoring scenarios
- ✅ Notification systems

**Examples:**
- Notification count/list
- Live dashboards
- Status monitors
- Chat messages
- Active user lists
- Real-time metrics

**Code:**
```typescript
@Injectable({ providedIn: 'root' })
export class NotificationRepository extends LiveRepositoryService<NotificationDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/notifications', logger, 30); // Poll every 30 seconds
  }
}

// Usage - Auto-updating observable
notifications$ = this.notificationRepo.live$; // Refreshes every 30s!
```

---

## 🏗️ Architecture Comparison

### **Standard Repository**

```
Component
    ↓ (subscribes once)
Service (with signals)
    ↓ (one-shot call)
Standard Repository
    ↓ (HTTP GET)
API
```

**Data Flow:**
1. Component/service calls `getAll()`
2. Single HTTP request
3. Data returned once
4. To refresh: call `getAll()` again

---

### **Live Repository**

```
Component
    ↓ (subscribes to live$)
Live Repository
    ↓ (timer triggers every N seconds)
    ↓ (HTTP GET)
API
    ↓ (new data flows back)
Component (auto-updates!)
```

**Data Flow:**
1. Component subscribes to `live$`
2. Timer automatically polls API every N seconds
3. New data flows to all subscribers
4. Component auto-updates (no manual refresh!)

---

## 📊 Pattern Decision Matrix

| Scenario | Standard | Live | Reason |
|----------|----------|------|--------|
| **Product catalog** | ✅ | ❌ | Static data, user-initiated refresh |
| **Notification bell** | ❌ | ✅ | Needs real-time updates |
| **User profile edit** | ✅ | ❌ | Only changes on user action |
| **Live dashboard** | ❌ | ✅ | Continuous monitoring |
| **Settings page** | ✅ | ❌ | Infrequent changes |
| **Chat messages** | ❌ | ✅ | Real-time communication |
| **Form dropdowns** | ✅ | ❌ | Reference data, rarely changes |
| **Active users list** | ❌ | ✅ | Frequent updates needed |
| **Blog posts** | ✅ | ❌ | Content changes rarely |
| **System status** | ❌ | ✅ | Monitor health continuously |

---

## 💡 Implementation Examples

### **Example 1: Standard Repository + Signals**

**Scenario:** Product catalog that user can manually refresh

```typescript
// Repository (standard)
@Injectable({ providedIn: 'root' })
export class ProductRepository extends RepositoryService<ProductDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/products', logger);
  }
}

// Service (with signals)
@Injectable({ providedIn: 'root' })
export class ProductService {
  products = signal<ProductViewModel[]>([]);
  loading = signal(false);
  
  constructor(
    private repo: ProductRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.loadProducts();
  }
  
  loadProducts() {
    this.loading.set(true);
    
    return this.repo.getAll().pipe(
      map(dtos => mapProductDtosToViewModels(dtos)),
      tap(vms => {
        this.products.set(vms);
        this.loading.set(false);
      })
    );
  }
  
  // User-initiated refresh
  refresh() {
    this.loadProducts().subscribe();
  }
}

// Component
@Component({...})
export class ProductListComponent {
  constructor(public productService: ProductService) {}
  
  onRefreshClick() {
    this.productService.refresh();
  }
}

// Template
<div *ngFor="let product of productService.products()">
  {{ product.name }}
</div>
<button (click)="onRefreshClick()">Refresh</button>
```

---

### **Example 2: Live Repository + Observable**

**Scenario:** Notification bell that auto-updates

```typescript
// Repository (live with 30s polling)
@Injectable({ providedIn: 'root' })
export class NotificationRepository extends LiveRepositoryService<NotificationDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/notifications', logger, 30); // Poll every 30s
  }
}

// Service (simple wrapper)
@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Auto-updating observable
  notifications$ = this.repo.live$.pipe(
    map(dtos => mapNotificationDtosToViewModels(dtos))
  );
  
  unreadCount$ = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.read).length)
  );
  
  constructor(private repo: NotificationRepository) {}
  
  // Force immediate refresh
  refresh() {
    this.repo.refresh();
  }
  
  // Pause when user navigates away
  pause() {
    this.repo.pausePolling();
  }
  
  // Resume when user returns
  resume() {
    this.repo.resumePolling();
  }
}

// Component
@Component({
  selector: 'app-notification-bell',
  template: `
    <button class="notification-bell">
      <i class="bell-icon"></i>
      <span class="badge">{{ unreadCount$ | async }}</span>
    </button>
    <ul *ngIf="notifications$ | async as notifications">
      <li *ngFor="let notification of notifications">
        {{ notification.title }}
      </li>
    </ul>
  `
})
export class NotificationBellComponent implements OnDestroy {
  notifications$ = this.notificationService.notifications$;
  unreadCount$ = this.notificationService.unreadCount$;
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnDestroy() {
    // Pause polling when component destroyed
    this.notificationService.pause();
  }
}
```

---

### **Example 3: Hybrid Approach**

**Scenario:** Data that needs both one-shot fetch AND live updates

```typescript
// Repository extends BOTH patterns
@Injectable({ providedIn: 'root' })
export class DashboardRepository extends LiveRepositoryService<DashboardDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/dashboard', logger, 60); // Poll every 60s
  }
  
  // Still has all standard repository methods!
  // - getAll() - one-shot fetch
  // - getById() - single item
  // - create() - CRUD operations
  // PLUS:
  // - live$ - auto-updating stream
}

// Service uses BOTH patterns
@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Auto-updating metrics (live$)
  liveMetrics$ = this.repo.live$.pipe(
    map(dtos => mapDashboardDtosToViewModels(dtos))
  );
  
  // One-shot historical data (standard method)
  loadHistoricalData(dateRange: DateRange) {
    return this.repo.query({ 
      startDate: dateRange.start, 
      endDate: dateRange.end 
    });
  }
  
  constructor(private repo: DashboardRepository) {}
}

// Component uses both patterns
@Component({...})
export class DashboardComponent {
  // Live updates
  liveMetrics$ = this.dashboardService.liveMetrics$;
  
  // Historical data (loaded on demand)
  historicalData$ = new BehaviorSubject<HistoricalData | null>(null);
  
  constructor(private dashboardService: DashboardService) {}
  
  loadHistory(dateRange: DateRange) {
    this.dashboardService.loadHistoricalData(dateRange).subscribe(data => {
      this.historicalData$.next(data);
    });
  }
}
```

---

## 🎨 Best Practices

### **Standard Repository Best Practices:**

1. **Use Signals for State**
   ```typescript
   products = signal<ProductViewModel[]>([]);
   loading = signal(false);
   ```

2. **Manual Refresh Pattern**
   ```typescript
   refresh() {
     this.loading.set(true);
     this.repo.getAll().pipe(
       tap(data => this.products.set(data)),
       finalize(() => this.loading.set(false))
     ).subscribe();
   }
   ```

3. **Error Handling**
   ```typescript
   catchError(err => {
     this.error.set('Failed to load');
     return of([]);
   })
   ```

---

### **Live Repository Best Practices:**

1. **Pause When Not Visible**
   ```typescript
   ngOnDestroy() {
     this.repo.pausePolling();
   }
   ```

2. **Shared Observables**
   ```typescript
   // ✅ GOOD: Share single poll stream
   notifications$ = this.repo.live$;
   
   // ❌ BAD: Multiple polls
   notifications$ = this.repo.getAll().pipe(...polling logic...);
   ```

3. **Manual Refresh Available**
   ```typescript
   // Poll every 60s, but allow manual refresh
   onRefreshClick() {
     this.repo.refresh();
   }
   ```

4. **Configurable Polling**
   ```typescript
   // Disable polling in dev mode
   const pollInterval = environment.production ? 30 : 0;
   super(http, url, logger, pollInterval);
   ```

---

## ⚠️ Anti-Patterns

### **DON'T: Use Live Repository for Static Data**

```typescript
// ❌ BAD: Products don't need polling
export class ProductRepository extends LiveRepositoryService<ProductDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/products', logger, 30); // Wasteful!
  }
}
```

**Why Bad:**
- Unnecessary server load
- Wasted bandwidth
- Battery drain on mobile
- Complexity for no benefit

**Fix:**
```typescript
// ✅ GOOD: Use standard repository
export class ProductRepository extends RepositoryService<ProductDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/products', logger);
  }
}
```

---

### **DON'T: Manual Polling in Standard Repository**

```typescript
// ❌ BAD: Building polling manually
@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private repo: NotificationRepository) {
    // Manual polling - reinventing the wheel!
    timer(0, 30000).pipe(
      switchMap(() => this.repo.getAll())
    ).subscribe(data => {
      this.notifications.set(data);
    });
  }
}
```

**Why Bad:**
- Reinventing existing pattern
- No pause/resume capability
- Hard to manage multiple subscribers
- Not shareable across components

**Fix:**
```typescript
// ✅ GOOD: Use LiveRepositoryService
export class NotificationRepository extends LiveRepositoryService<NotificationDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/notifications', logger, 30);
  }
}

// Service just exposes live$
@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications$ = this.repo.live$; // Done!
  
  constructor(private repo: NotificationRepository) {}
}
```

---

## 📚 Migration Guide

### **Migrating Old `MappedItemsCollectionServiceBase`**

**Old Pattern:**
```typescript
export class MyService extends MappedItemsCollectionServiceBase<Dto, string, Dto> {
  protected override pollDelayInSeconds: number = 60;
  
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<Dto[]> {
    return this.repo.getPage();
  }
  
  // ... complex mapping logic ...
}
```

**New Pattern Decision:**

**If data needs polling:**
```typescript
// 1. Create Live Repository
@Injectable({ providedIn: 'root' })
export class MyRepository extends LiveRepositoryService<MyDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/my-data', logger, 60); // Same 60s poll
  }
}

// 2. Simple service
@Injectable({ providedIn: 'root' })
export class MyService {
  data$ = this.repo.live$.pipe(
    map(dtos => mapDtosToViewModels(dtos))
  );
  
  constructor(private repo: MyRepository) {}
}
```

**If data doesn't need polling:**
```typescript
// 1. Create Standard Repository
@Injectable({ providedIn: 'root' })
export class MyRepository extends RepositoryService<MyDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/my-data', logger);
  }
}

// 2. Service with signals
@Injectable({ providedIn: 'root' })
export class MyService {
  data = signal<MyViewModel[]>([]);
  
  constructor(private repo: MyRepository) {
    this.loadData();
  }
  
  loadData() {
    this.repo.getAll().pipe(
      map(dtos => mapDtosToViewModels(dtos)),
      tap(vms => this.data.set(vms))
    ).subscribe();
  }
}
```

---

## 🎯 Summary

| Aspect | Standard Repository | Live Repository |
|--------|-------------------|-----------------|
| **Base Class** | `RepositoryService<T>` | `LiveRepositoryService<T>` |
| **Data Flow** | One-shot HTTP calls | Auto-updating stream |
| **Best For** | Static/semi-static data | Real-time/frequently changing data |
| **State Management** | Signals recommended | Observable streams |
| **Performance** | High (no background polling) | Moderate (polling overhead) |
| **Complexity** | Simple | Simple (pattern handles complexity) |
| **Manual Refresh** | Call `getAll()` again | Call `refresh()` method |
| **Multiple Subscribers** | Each gets own data | All share same poll stream |

---

## ✅ Checklist: Choosing the Right Pattern

**Use Standard Repository if:**
- [ ] Data changes only through user actions
- [ ] Performance is critical
- [ ] Data is reference/configuration data
- [ ] Updates are infrequent
- [ ] You need full CRUD control

**Use Live Repository if:**
- [ ] Data needs real-time updates
- [ ] Multiple users modify data
- [ ] Dashboard/monitoring scenario
- [ ] Notification/alert system
- [ ] Polling every X seconds makes sense

**Use Both (Hybrid) if:**
- [ ] Need live updates AND one-shot fetches
- [ ] Historical queries + real-time monitoring
- [ ] Complex dashboard with multiple data needs

---

**Last Updated:** 2025-12-28  
**Status:** ✅ Patterns Established  
**See Also:** 
- `REPOSITORY-PATTERN.md` - Standard Repository guide
- `repository.service.ts` - Standard implementation
- `live-repository.service.ts` - Live implementation
