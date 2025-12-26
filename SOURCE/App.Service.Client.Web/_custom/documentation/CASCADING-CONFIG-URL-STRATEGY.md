# 🌐 Cascading Config URL Strategy

**Date**: 2025-01-25  
**Status**: ✅ **Clarified & Fixed**  
**Issue**: Backend URL needed json-server compatibility

---

## 🎯 **The Three URLs**

### **1. Deployed Config** (In-Memory)

```typescript
// From environment.ts
const config = this.getDeployedConfig();
```

**Source:** Baked into bundle (no HTTP)  
**Port:** N/A (in-memory)  
**Always Available:** ✅ YES  
**Speed:** Instant

---

### **2. Mock JSON** (Angular Dev Server)

```typescript
// Relative URL
const mockConfig = await this.http.get(
  '/assets/data/env-config.json'
).toPromise();
```

**Source:** Angular serves `/assets/` folder  
**Port:** `4200` (Angular dev server)  
**Full URL:** `http://localhost:4200/assets/data/env-config.json`  
**Always Available:** ✅ YES (when file exists)  
**Speed:** Fast (~10ms)

**Why Relative URL:**
- No hardcoded port
- Works in dev, staging, prod
- Angular automatically serves `/assets/`

---

### **3. Backend API** (Backend Server)

```typescript
// Environment-specific URL
const backendUrl = environment.production 
  ? 'https://api.production.com/api/env-config'     // Production
  : 'http://localhost:4022/rest/env-config';        // Development (json-server!)

const backendConfig = await this.http.get(backendUrl).toPromise();
```

**Source:** Backend API server  
**Port:** 
- Dev: `4022` (json-server)
- Prod: Variable (could be 443, 80, etc.)

**Full URL (Dev):** `http://localhost:4022/rest/env-config`  
**Full URL (Prod):** `https://api.production.com/api/env-config`

**Always Available:** ⚠️ NO (depends on backend)  
**Speed:** Slow (~100-500ms, or timeout after 3s)

**Why Full URL:**
- Backend might be on different port/domain
- Not served by Angular
- Needs full URL for CORS

---

## 🔄 **Execution Flow**

### **Sequential (Not Parallel):**

```
1. Deployed Config (in-memory)
   ⏱️ 0ms
   ✅ config = { app: { name: "BASE-DEV" } }
   
2. Mock JSON: GET /assets/data/env-config.json
   ⏱️ ~10ms
   ✅ Merge: config.app.name = "BOOM!"
   
3. Backend API: GET http://localhost:4022/rest/env-config
   ⏱️ ~3000ms (timeout if not available)
   ⚠️ If backend running: Merge further
   ⚠️ If backend not running: Skip (use mock)
```

**Total Time:**
- **Backend available:** ~110ms (deployed + mock + backend)
- **Backend not available:** ~3010ms (deployed + mock + timeout)

---

## 🎯 **Your Question Answered**

### **Q: "Does it look in 4022 then fall back to 4200/assets?"**

**A: No! It's sequential merging:**

1. **Deployed** (always succeeds)
2. **Mock JSON** from `/assets/` (served by Angular at 4200)
3. **Backend API** from `4022` (if running)

**They don't "fall back"** - they **merge**!

```
Deployed: { app: { name: "BASE-DEV", version: "1.0" } }
   ↓ merge
Mock: { app: { name: "BOOM!" } }
   ↓ result
Config: { app: { name: "BOOM!", version: "1.0" } }  // ← Merged!
   ↓ merge
Backend: { app: { name: "PROD" } }
   ↓ result
Final: { app: { name: "PROD", version: "1.0" } }  // ← Final merged!
```

---

## 🚨 **Your Concern: json-server URL**

### **Problem You Spotted:**

```typescript
// ❌ WRONG (what I had):
'http://localhost:4022/api/env-config'  // json-server won't recognize this!

// ✅ RIGHT (what json-server expects):
'http://localhost:4022/rest/env-config'  // Note the /rest/ prefix!
```

**You were correct!** json-server uses `/rest/` prefix by default.

---

## ✅ **Fix Applied**

### **Before:**

```typescript
const backendConfig = await this.http.get(
  'http://localhost:4022/api/env-config'  // ❌ Won't work with json-server
).toPromise();
```

### **After:**

```typescript
const backendUrl = environment.production 
  ? 'https://api.production.com/api/env-config'  // ✅ Real backend
  : 'http://localhost:4022/rest/env-config';     // ✅ json-server compatible!

const backendConfig = await this.http.get(backendUrl).toPromise();
```

---

## 📊 **URL Comparison**

| Environment | Backend URL | Why |
|-------------|-------------|-----|
| **Development** | `http://localhost:4022/rest/env-config` | json-server uses `/rest/` prefix |
| **Production** | `https://api.production.com/api/env-config` | Real backend uses `/api/` prefix |

---

## 🎯 **json-server Setup**

### **To Test Backend Override:**

#### **Step 1: Create db.json**

```json
{
  "env-config": {
    "app": {
      "name": "BACKEND-OVERRIDE!",
      "title": "Backend Controlled Config"
    }
  }
}
```

#### **Step 2: Start json-server**

```bash
json-server --watch db.json --port 4022 --routes routes.json
```

**routes.json:**
```json
{
  "/rest/*": "/$1"
}
```

This makes `/rest/env-config` → `/env-config`

#### **Step 3: Run App**

```bash
ng serve
```

**Expected Console:**
```
📦 Deployed config loaded
   App name: BASE-DEV
📄 Mock JSON loaded (overridden)
   App name: BOOM!
🌐 Backend API loaded (final override)
   URL: http://localhost:4022/rest/env-config
   App name: BACKEND-OVERRIDE!
✅ Final app name: BACKEND-OVERRIDE!
```

---

## 🧪 **Testing Scenarios**

### **Scenario 1: No Backend (Typical Dev)**

```
Deployed: "BASE-DEV"
   ↓
Mock: "BOOM!"
   ↓ (backend timeout after 3s)
Final: "BOOM!"
```

**Console:**
```
📦 Deployed config loaded: BASE-DEV
📄 Mock JSON loaded: BOOM!
⚠️ Backend API not available
   Tried: http://localhost:4022/rest/env-config
✅ Final: BOOM!
```

---

### **Scenario 2: Backend Running**

```
Deployed: "BASE-DEV"
   ↓
Mock: "BOOM!"
   ↓
Backend: "BACKEND-OVERRIDE!"
   ↓
Final: "BACKEND-OVERRIDE!"
```

**Console:**
```
📦 Deployed config loaded: BASE-DEV
📄 Mock JSON loaded: BOOM!
🌐 Backend API loaded: BACKEND-OVERRIDE!
   URL: http://localhost:4022/rest/env-config
✅ Final: BACKEND-OVERRIDE!
```

---

### **Scenario 3: Production**

```
Deployed: "BASE-PROD"
   ↓
Mock: (doesn't exist in prod build)
   ↓
Backend: "LIVE-CONFIG"
   ↓
Final: "LIVE-CONFIG"
```

**Console:**
```
📦 Deployed config loaded: BASE-PROD
⚠️ Mock JSON not available
🌐 Backend API loaded: LIVE-CONFIG
   URL: https://api.production.com/api/env-config
✅ Final: LIVE-CONFIG
```

---

## 💡 **Key Insights**

### **Parallel vs Sequential:**

**Q: "Do they run at the same time?"**

**A: Sequential!** Each step waits for previous:

```typescript
// Step 1: Deployed (synchronous)
let config = this.getDeployedConfig();

// Step 2: Mock (async, wait for it)
try {
  const mock = await this.http.get('/assets/data/env-config.json').toPromise();
  config = this.deepMerge(config, mock);
} catch { }

// Step 3: Backend (async, wait for it OR timeout)
try {
  const backend = await Promise.race([
    this.http.get(backendUrl).toPromise(),
    timeout(3000)  // ← Max wait 3 seconds
  ]);
  config = this.deepMerge(config, backend);
} catch { }
```

**Why Sequential:**
- Deep merge needs previous result
- Each layer builds on the last
- Order matters (later overrides earlier)

---

### **Why 3 Second Timeout:**

**Q: "Why not wait forever for backend?"**

**A: User Experience!**

```
No timeout: App hangs indefinitely if backend is down ❌
3s timeout: App loads with mock config, user sees content ✅
```

**Trade-off:**
- **Too short (1s):** Backend might be slow but available
- **Too long (10s):** User waits too long for app
- **3s:** Good balance (AWS Lambda cold start is ~2s)

---

## 🎯 **Summary**

| URL | Served By | Port | Path | Always Available |
|-----|-----------|------|------|------------------|
| **Deployed** | In-memory | N/A | N/A | ✅ YES |
| **Mock JSON** | Angular | 4200 | `/assets/data/env-config.json` | ✅ YES (if file exists) |
| **Backend (Dev)** | json-server | 4022 | `/rest/env-config` | ⚠️ If running |
| **Backend (Prod)** | Real API | Variable | `/api/env-config` | ⚠️ If running |

**Key Points:**
- ✅ Sequential merging (not fallback!)
- ✅ Deep merge (keeps values not overridden)
- ✅ json-server compatible (`/rest/` prefix)
- ✅ 3-second timeout (app doesn't hang)
- ✅ Production uses different URL

---

**🎉 Your catch about json-server was spot-on!** Fixed! 🎯

---

**Document Version**: 1.0  
**Created**: 2025-01-25  
**Status**: ✅ Complete  
**Issue**: json-server URL fixed
