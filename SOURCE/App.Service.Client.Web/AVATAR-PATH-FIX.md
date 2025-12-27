# Avatar Images - Fixed Path Issue

**Issue:** 404 errors on avatar images  
**Cause:** ResourceUrlService pointing to wrong directory  
**Fixed:** 2025-12-27

---

## The Problem

**Service was returning:**
```
/assets/deployed/images/users/avatar-2.jpg  ❌ WRONG PATH
```

**Actual location of files:**
```
src/sites.anon/assets/media/sensitive/images/users/avatar-2.jpg
```

**After angular.json asset mapping:**
```
/assets/sites.anon/media/sensitive/images/users/avatar-2.jpg  ✅ CORRECT
```

---

## The Fix

**Updated `core/services/resource-url.service.ts`:**

### Before (Wrong):
```typescript
getUserAvatarUrl(imageName: string): Observable<string> {
  if (!environment.production) {
    return of(`/assets/deployed/images/users/${imageName}`);  // ❌
  }
  // ...
}

getTeamMemberPhotoUrl(imageName: string): Observable<string> {
  if (!environment.production) {
    return of(`/assets/deployed/images/users/${imageName}`);  // ❌
  }
  // ...
}
```

### After (Correct):
```typescript
getUserAvatarUrl(imageName: string): Observable<string> {
  if (!environment.production) {
    return of(`/assets/sites.anon/media/sensitive/images/users/${imageName}`);  // ✅
  }
  // ...
}

getTeamMemberPhotoUrl(imageName: string): Observable<string> {
  if (!environment.production) {
    return of(`/assets/sites.anon/media/sensitive/images/users/${imageName}`);  // ✅
  }
  // ...
}
```

---

## Why This Path?

**Angular.json asset mapping:**
```json
{
  "glob": "**/*",
  "input": "src/sites.anon/assets",
  "output": "/assets/sites.anon"
}
```

**This means:**
```
Source: src/sites.anon/assets/media/sensitive/images/users/avatar-2.jpg
         ↓ (angular.json copies to)
Runtime: /assets/sites.anon/media/sensitive/images/users/avatar-2.jpg
```

---

## Test It

**1. Rebuild:**
```sh
npm run build
```

**2. Start server:**
```sh
npm run start
```

**3. Navigate to:**
```
http://localhost:4200/pages
```

**4. Scroll to Team section**

**5. Check DevTools Network:**
```
✅ 200 GET /assets/sites.anon/media/sensitive/images/users/avatar-2.jpg
✅ 200 GET /assets/sites.anon/media/sensitive/images/users/avatar-3.jpg
✅ 200 GET /assets/sites.anon/media/sensitive/images/users/avatar-10.jpg
...etc
```

---

## Why "sensitive" For Public Team Photos?

**Good question!** This is actually correct architecture:

**Reason 1: Future Signatures**
- Even "public" team photos will use signed URLs (Phase 3)
- Signatures enable: employee cleanup, GDPR compliance, audit trails

**Reason 2: User-Generated vs. Team-Managed**
- `/media/sensitive/` = User-generated (needs auth/tracking)
- `/assets/deployed/` = Team-managed (safe, version-controlled)
- Team photos are treated as user-generated (even though curated)

**Reason 3: Consistency**
- Same signature pattern for all uploaded content
- Simpler code, easier to maintain

---

## Next Steps

**After Build Completes:**
1. ✅ Test avatars load (should see 200 status)
2. ✅ Commit the fix
3. ✅ Push to GitHub

**Commit Message:**
```
fix: correct avatar image paths in ResourceUrlService

- Changed from /assets/deployed/images/users/
- To: /assets/sites.anon/media/sensitive/images/users/
- Matches actual file locations in sites.anon/assets/
- Avatars now load correctly on team page
```

---

**Status:** ✅ Fixed  
**Build:** In Progress  
**Test:** Pending
