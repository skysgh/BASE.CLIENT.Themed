# Resource Signature Strategy

**Created:** 2025-12-27  
**Status:** 🚀 Active - Phase 1 Implemented  
**Owner:** Architecture Team

---

## 🎯 Executive Summary

**Decision:** Use signature-based URLs for ALL resource access (including "public" images)

**Why:** Employee cleanup, GDPR compliance, cost control, audit trails, code consistency

**Status:** 
- ✅ **Phase 1:** ResourceUrlService created (dev mode - direct paths)
- ⏳ **Phase 2:** Add caching, normalization (when needed)
- ⏳ **Phase 3:** Signed URLs via API + blob storage (when API ready)

---

## 📊 The Problem We're Solving

### **Scenario: Team Member Leaves Company**

**Without Signatures:**
```
1. Employee uploads public team photo → stored in /media/open/team/
2. Employee leaves company
3. Photo still accessible at original URL
4. ❌ Manual cleanup required (error-prone)
5. ❌ GDPR violation if not cleaned up
6. ❌ Ex-employee photo lingers indefinitely
```

**With Signatures:**
```
1. Employee uploads photo → stored in blob storage
2. Photo accessed via signed URL (signature key tied to employee)
3. Employee leaves company
4. ✅ Expire employee's signature key
5. ✅ All their uploads become instantly inaccessible
6. ✅ Automatic cleanup, GDPR compliant
```

---

## 🏗️ Architecture

### **Three-Phase Implementation**

```
┌─────────────────────────────────────────────────────────┐
│                   ResourceUrlService                     │
├─────────────────────────────────────────────────────────┤
│ Phase 1 (NOW):                                          │
│ ✅ Returns: /assets/deployed/images/users/avatar.jpg    │
│ ✅ Mode: Development (theme assets)                     │
│ ✅ Signatures: None (not needed for mock data)          │
│                                                          │
│ Phase 2 (NEXT):                                         │
│ ⏳ Add: Caching layer                                    │
│ ⏳ Add: Path normalization                               │
│ ⏳ Add: Fallback handling                                │
│                                                          │
│ Phase 3 (PRODUCTION):                                   │
│ ⏳ Returns: https://cdn.example.com/path?sig=abc&exp=123│
│ ⏳ Mode: Production (blob storage)                      │
│ ⏳ Signatures: Required for ALL resources                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Why Signatures for "Public" Resources?

### **You Might Think:**
> "Public team photos don't need signatures - they're meant to be seen!"

### **The Reality:**

| Concern | Without Signatures | With Signatures |
|---------|-------------------|-----------------|
| **Employee Departure** | Manual cleanup → errors | Expire key → instant cleanup |
| **GDPR Right to Forget** | Must track all copies | Expire signature → instant revocation |
| **Cost/Bandwidth** | Vulnerable to hotlinking | Signature prevents unauthorized access |
| **Audit Trail** | No tracking | Every access logged |
| **Legal Compliance** | High risk of violations | Automatic compliance |

---

## 📝 Code Examples

### **Phase 1: Development Mode (NOW)**

**Component:**
```typescript
@Component({ /* ... */ })
export class TeamComponent {
  constructor(private resourceUrlService: ResourceUrlService) {}
  
  getUserPhotoUrl(imageName: string): Observable<string> {
    // ✅ Service handles dev/prod mode automatically
    return this.resourceUrlService.getTeamMemberPhotoUrl(imageName);
  }
}
```

**Template:**
```html
<!-- ✅ async pipe handles Observable -->
<img [src]="getUserPhotoUrl(data.imageName) | async" alt="">
```

**What It Returns (Dev Mode):**
```
/assets/deployed/images/users/avatar-2.jpg
```

---

### **Phase 3: Production Mode (FUTURE)**

**Same Component Code (No Changes Needed!):**
```typescript
// ✅ SAME CODE - Service handles the difference internally
getUserPhotoUrl(imageName: string): Observable<string> {
  return this.resourceUrlService.getTeamMemberPhotoUrl(imageName);
}
```

**What It Returns (Production):**
```
https://cdn.example.com/team/avatar-2.jpg?sig=abc123&exp=1704067200
```

**API Call (Under the Hood):**
```typescript
// ResourceUrlService internally calls:
this.http.post('/api/resources/sign', {
  path: 'public/team/avatar-2.jpg',
  expiryMinutes: 60,
  reason: 'team_member_photo'  // Audit trail
}).pipe(map(r => r.url))
```

---

## 🚀 Benefits

### **1. Employee Cleanup** (Your Original Concern!)
```typescript
// When employee leaves:
await revokeSignatureKey(employeeId);

// Result: All their uploads instantly inaccessible
// No manual cleanup needed
// No orphaned images
```

### **2. GDPR Compliance**
```typescript
// User requests "right to be forgotten":
await revokeUserSignatures(userId);

// Result: Instant revocation
// Automatic compliance
// No risk of missed copies
```

### **3. Cost Control**
```
Without signatures: Anyone can hotlink → bandwidth theft
With signatures: Only authorized access → cost control
```

### **4. Audit Trail**
```sql
SELECT * FROM resource_access_logs 
WHERE resource_path = 'team/avatar-2.jpg'
  AND accessed_at > NOW() - INTERVAL 30 days;

-- Shows: who, when, why, how long
-- Required for: Security audits, legal compliance
```

### **5. Code Consistency**
```typescript
// ✅ ONE pattern for ALL resources:
resourceUrlService.getTeamMemberPhotoUrl(name);  // Public
resourceUrlService.getUserDocumentUrl(id, name); // Private
resourceUrlService.getUserAvatarUrl(name);       // User-uploaded

// ❌ WITHOUT service - inconsistent patterns:
const url = `/assets/media/${type}/${name}`;  // Direct path
const url = this.config.paths.team + name;    // Config-based
const url = await api.getSignedUrl(path);     // API call
```

---

## 🧪 Testing Strategy

### **Unit Tests (Service):**
```typescript
describe('ResourceUrlService', () => {
  it('should return theme path in dev mode', (done) => {
    service.getTeamMemberPhotoUrl('avatar-2.jpg')
      .subscribe(url => {
        expect(url).toBe('/assets/deployed/images/users/avatar-2.jpg');
        done();
      });
  });
  
  it('should call API in production mode', () => {
    // Set production mode
    spyOn(http, 'post').and.returnValue(of({ url: 'https://cdn.example.com/...' }));
    
    service.getTeamMemberPhotoUrl('avatar-2.jpg').subscribe();
    
    expect(http.post).toHaveBeenCalledWith('/api/resources/sign', jasmine.any(Object));
  });
});
```

### **Integration Tests (Component):**
```typescript
describe('TeamComponent', () => {
  it('should display team member photos', () => {
    const mockService = jasmine.createSpyObj('ResourceUrlService', ['getTeamMemberPhotoUrl']);
    mockService.getTeamMemberPhotoUrl.and.returnValue(of('/mock/avatar.jpg'));
    
    // Test component with mock service
    const fixture = TestBed.createComponent(TeamComponent);
    fixture.componentInstance.resourceUrlService = mockService;
    
    // Verify photos load
    expect(fixture.nativeElement.querySelector('img').src).toContain('mock/avatar.jpg');
  });
});
```

---

## 📋 Implementation Checklist

### **Phase 1: Development Mode** ✅ COMPLETE
- [x] Create `ResourceUrlService`
- [x] Implement `getUserAvatarUrl()` (dev mode)
- [x] Implement `getTeamMemberPhotoUrl()` (dev mode)
- [x] Implement `getUserDocumentUrl()` (dev mode)
- [x] Update team component to use service
- [x] Add `async` pipe to template
- [x] Test avatars load correctly
- [x] Document the pattern

### **Phase 2: Enhancements** ⏳ FUTURE
- [ ] Add caching layer (avoid redundant API calls)
- [ ] Add path normalization (handle edge cases)
- [ ] Add fallback URLs (graceful degradation)
- [ ] Add retry logic (network failures)
- [ ] Add loading indicators (better UX)

### **Phase 3: Production** ⏳ WHEN API READY
- [ ] Implement API endpoint: `POST /api/resources/sign`
- [ ] Configure blob storage (Azure/AWS/GCP)
- [ ] Implement signature generation (HMAC-SHA256)
- [ ] Add signature validation middleware
- [ ] Configure CDN (CloudFront/Cloudflare)
- [ ] Set up expiration jobs (cleanup expired signatures)
- [ ] Add monitoring/alerts (signature abuse detection)

---

## 🔧 API Design (Phase 3)

### **Request:**
```http
POST /api/resources/sign
Authorization: Bearer <token>
Content-Type: application/json

{
  "path": "public/team/avatar-2.jpg",
  "expiryMinutes": 60,
  "reason": "team_member_photo"
}
```

### **Response:**
```json
{
  "url": "https://cdn.example.com/public/team/avatar-2.jpg?sig=abc123&exp=1704067200",
  "expiresAt": "2024-01-01T12:00:00Z",
  "signatureId": "sig_abc123"
}
```

### **Signature Format:**
```
URL: https://cdn.example.com/path/to/resource.jpg
Signature: HMAC-SHA256(path + expiry + secret_key)
Final URL: {URL}?sig={signature}&exp={unix_timestamp}
```

---

## 🚨 Security Considerations

### **Signature Key Management:**
```typescript
// ✅ DO: Use per-employee keys (enables cleanup)
const key = deriveKey(employeeId, masterSecret);

// ❌ DON'T: Use single shared key (can't revoke individual access)
const key = process.env.MASTER_SECRET;
```

### **Expiration Times:**
```typescript
// Public resources (team photos):
expiryMinutes: 60  // 1 hour (reasonable for caching)

// Sensitive documents:
expiryMinutes: 15  // 15 minutes (minimize exposure window)

// Temporary shares:
expiryMinutes: 5   // 5 minutes (one-time use)
```

### **Rate Limiting:**
```typescript
// Prevent signature abuse:
rateLimiter.limit('/api/resources/sign', {
  maxRequests: 100,
  windowMinutes: 1,
  perUser: true
});
```

---

## 📖 Related Documentation

- **Service Implementation:** `core/services/resource-url.service.ts`
- **Team Component Example:** `sites.anon/features/pages/landing/team/component.ts`
- **Navigation Patterns:** `_custom/documentation/patterns/navigation-public-private-split-summary.md`
- **Multi-Account Support:** `_custom/documentation/patterns/multi-account-i18n-support.md`

---

## ❓ FAQ

**Q: Why not just use direct paths for public images?**  
**A:** Employee cleanup, GDPR compliance, cost control, audit trails. The overhead is minimal, the benefits are massive.

**Q: Won't signatures slow down page load?**  
**A:** Phase 2 adds caching. Signatures are generated once, cached, reused until expiry.

**Q: What if the API is down?**  
**A:** Phase 2 adds fallback URLs. Graceful degradation ensures site stays functional.

**Q: Can I bypass signatures in dev mode?**  
**A:** Yes! Phase 1 (current) uses direct paths. No API needed for development.

**Q: When should I implement Phase 3?**  
**A:** When you have: (1) Backend API, (2) Blob storage, (3) Production deployment plan.

---

**Status:** 🚀 Phase 1 Complete - Ready for Development  
**Next Step:** Build features, worry about Phase 3 when API is ready  
**Review Date:** When planning production deployment

---

**Last Updated:** 2025-12-27  
**Document Version:** 1.0  
**Status:** Active Pattern - Use for All New Resource Access
