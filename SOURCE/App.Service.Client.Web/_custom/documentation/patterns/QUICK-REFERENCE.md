# 🎯 Repository Migration - Quick Reference Card

**Current Status:** ✅ Phase 2A Complete - Build Passing - Ready for Phase 2B

---

## 🚀 Quick Start

### **To Start Next Migration:**

```bash
# 1. Start dev server
npm run start

# 2. Choose service:
#    - ServiceNotification (live pattern) ← RECOMMENDED
#    - ServiceEndorsement (standard pattern)

# 3. Follow checklist in:
#    PHASE-2B-KICKOFF.md
```

---

## 📋 Two Patterns Available

### **Pattern 1: Standard Repository**

**Use When:** Data is static/semi-static

```typescript
// Repository
export class MyRepository extends RepositoryService<MyDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/my-data', logger);
  }
}

// Service
@Injectable({ providedIn: 'root' })
export class MyService {
  items = signal<MyViewModel[]>([]);
  
  loadItems() {
    this.repo.getAll().pipe(
      map(dtos => mapDtosToViewModels(dtos)),
      tap(vms => this.items.set(vms))
    ).subscribe();
  }
}
```

---

### **Pattern 2: Live Repository**

**Use When:** Data needs auto-refresh

```typescript
// Repository (polls every 30s)
export class NotificationRepository extends LiveRepositoryService<NotificationDto> {
  constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
    super(http, '/api/notifications', logger, 30);
  }
}

// Service (auto-updating!)
@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications$ = this.repo.live$; // Auto-updates every 30s!
  
  constructor(private repo: NotificationRepository) {}
}
```

---

## 📚 Key Files

### **Documentation:**
- `REPOSITORY-PATTERN.md` - How to use standard pattern
- `REPOSITORY-STANDARD-VS-LIVE.md` - When to use each
- `PHASE-2B-KICKOFF.md` - Migration checklist

### **Examples:**
- `ServiceFeatureService` - Complete standard pattern
- `notification.repository.example.ts` - Live pattern

### **Tests:**
- `service-feature.*.spec.ts` - 60+ test examples

---

## ✅ Migration Checklist (Per Service)

**Time:** ~2 hours per service

- [ ] Create DTO model (5 min)
- [ ] Create ViewModel (5 min)
- [ ] Create mapper + tests (20 min)
- [ ] Create repository + tests (20 min)
- [ ] Create service + tests (30 min)
- [ ] Update components (20 min)
- [ ] Move old files to `_removed/` (5 min)
- [ ] Update status document (5 min)
- [ ] Run tests & verify (10 min)

---

## 🎯 Pattern Decision

**Standard Repository For:**
- Product catalogs
- User profiles
- Settings/configuration
- Form reference data
- Blog posts
- 95% of services

**Live Repository For:**
- Notifications
- Dashboards
- Status monitors
- Chat messages
- Live metrics
- 5% of services

---

## 📊 Progress

**Completed:** 1/9 (ServiceFeature)

**Remaining:**
- ServiceNotification ← NEXT (Live)
- ServiceEndorsement (Standard)
- ServiceCapability (Standard)
- ServiceStats (Standard)
- ServiceTrustedBy (Standard)
- ServiceFaqs (Standard)
- ServiceLanguages (Standard)
- ServicePricingPlans (Standard)

---

## 💡 Quick Tips

**Copy-Paste Approach:**
1. Copy ServiceFeature files
2. Rename to new service
3. Update models/interfaces
4. Update API endpoint
5. Update tests
6. Run & verify

**Test-First Approach:**
1. Write mapper tests
2. Implement mapper
3. Write repository tests
4. Implement repository
5. Write service tests
6. Implement service

---

## 🔧 Troubleshooting

**Build Errors?**
```bash
# Clear cache
rm -rf .angular dist node_modules/.cache
npm install
```

**Test Errors?**
```bash
# Check Chrome installed
# Or use different browser in karma.conf.js
```

**Type Errors?**
- Check DTO matches API
- Check ViewModel matches UI needs
- Check mapper handles all fields

---

## 📞 Need Help?

1. Check documentation (6 guides available)
2. Reference ServiceFeature example
3. Review test files for patterns
4. Follow checklist step-by-step

---

**BUILD:** ✅ PASSING  
**TESTS:** ✅ 60+ READY  
**DOCS:** ✅ COMPLETE  
**READY:** ✅ GO!

🚀 **LET'S MIGRATE THE NEXT SERVICE!**
