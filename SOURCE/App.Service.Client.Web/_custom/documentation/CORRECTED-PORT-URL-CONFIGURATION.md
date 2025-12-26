# 🎯 CORRECTED: Port and URL Configuration

**Date**: 2025-01-25  
**Status**: ✅ **CORRECTED** - Thanks to your catch!  
**Issue**: Wrong port and path for json-server

---

## ✅ **CORRECTED Configuration**

### **The Two Servers:**

```
Angular Dev Server (ng serve)
├─ Port: 4200
├─ Serves: Angular app + /assets/
└─ URL: http://localhost:4200/

json-server (npm run json-server)
├─ Port: 4202  ← YOUR CORRECTION!
├─ Serves: Simulated backend API
├─ Routes: /api/rest/* → /*
└─ URL: http://localhost:4202/api/rest/env-config
```

---

## 🎯 **Your Corrections**

### **Correction 1: Port Number**

**I said (Wrong):**
```typescript
'http://localhost:4022/...'  // ❌ Wrong port!
```

**You corrected:**
```typescript
'http://localhost:4202/...'  // ✅ Correct! (from package.json)
```

### **Correction 2: Path Structure**

**I said (Wrong first, then corrected):**
```typescript
'http://localhost:4202/rest/env-config'  // ❌ Missing /api/!
```

**You corrected:**
```typescript
'http://localhost:4202/api/rest/env-config'  // ✅ Correct! (from routes.json)
```

---

## 📊 **Complete URL Flow**

### **Mock JSON (Local File):**

```
Request: GET /assets/data/env-config.json
Server: Angular dev server (:4200)
Full URL: http://localhost:4200/assets/data/env-config.json
Source: Actual file on disk
Always available: ✅ YES (when file exists)
```

### **Backend API (json-server):**

```
Request: GET http://localhost:4202/api/rest/env-config
Server: json-server (:4202)
Routes through: /api/rest/* → /* (from routes.json)
Maps to: data.json → { "env-config": {...} }
Always available: ⚠️ Only if json-server running
```

---

## 🔍 **How json-server Routing Works**

### **Your routes.json:**

```json
{
  "/api/rest/*": "/$1"
}
```

**This means:**

```
Request: http://localhost:4202/api/rest/env-config
         ↓ (routes.json rewrites)
Becomes: http://localhost:4202/env-config
         ↓ (json-server looks in data.json)
Finds:   { "env-config": {...} }
```

**Example data.json structure:**

```json
{
  "env-config": {
    "app": {
      "name": "BACKEND-OVERRIDE!"
    }
  }
}
```

---

## 🚀 **The Complete Cascading Flow**

### **Step 1: Deployed Config** (In-Memory)

```
Source: environment.ts (baked into bundle)
Port: N/A
Speed: Instant
Config: { app: { name: "BASE-DEV" } }
```

### **Step 2: Mock JSON** (Angular Serves)

```
Source: /assets/data/env-config.json
Port: 4200 (Angular dev server)
Full URL: http://localhost:4200/assets/data/env-config.json
Speed: ~10ms
Merge: { app: { name: "BOOM!" } }
Result: { app: { name: "BOOM!" } }  ← Overridden!
```

### **Step 3: Backend API** (json-server)

```
Source: json-server (if running)
Port: 4202 (json-server)
Full URL: http://localhost:4202/api/rest/env-config
Routes to: data.json → env-config
Speed: ~100ms (or timeout after 3s)
Merge: { app: { name: "BACKEND-OVERRIDE!" } }
Result: { app: { name: "BACKEND-OVERRIDE!" } }  ← Final!
```

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Only Angular Running** (Typical Dev)

```bash
# Terminal 1:
npm run start  # Starts Angular at :4200
```

**Result:**
```
📦 Deployed: BASE-DEV
📄 Mock JSON: BOOM!  ← From :4200/assets/
⚠️ Backend not available (tried :4202/api/rest/)
✅ Final: BOOM!
```

---

### **Scenario 2: Both Running** (Full Test)

```bash
# Terminal 1:
npm run json-server  # Starts json-server at :4202

# Terminal 2:
npm run start  # Starts Angular at :4200

# Or use:
npm run start-local-json-server  # Both together!
```

**Result:**
```
📦 Deployed: BASE-DEV
📄 Mock JSON: BOOM!  ← From :4200/assets/
🌐 Backend API: BACKEND-OVERRIDE!  ← From :4202/api/rest/
✅ Final: BACKEND-OVERRIDE!
```

---

### **Scenario 3: Production**

```bash
# Production build deployed
```

**URLs:**
```
Mock JSON: https://app.com/assets/data/env-config.json  ← Might not exist
Backend API: https://api.production.com/api/env-config  ← Real backend!
```

**Result:**
```
📦 Deployed: BASE-PROD
⚠️ Mock JSON: Not available (not in prod build)
🌐 Backend API: LIVE-CONFIG  ← From real backend
✅ Final: LIVE-CONFIG
```

---

## 📝 **package.json Script Commands**

### **Your Scripts:**

```json
{
  "scripts": {
    "start": "ng serve",  // Angular only (:4200)
    "json-server": "json-server --port=4202 --routes=_custom/json-server/routes.json _custom/json-server/data.json",
    "start-local-json-server": "concurrently --kill-others-on-fail \"npm run json-server\" \"npm run start\""  // Both!
  }
}
```

**Usage:**

```bash
# Development with mock JSON only:
npm run start

# Development with backend API:
npm run start-local-json-server
```

---

## 🎯 **Key Points**

### **Two Separate Servers:**

| Aspect | Angular (:4200) | json-server (:4202) |
|--------|----------------|---------------------|
| **Purpose** | Serve Angular app | Simulate backend API |
| **Serves** | App + /assets/ | API endpoints |
| **Mock JSON** | ✅ YES (/assets/data/) | ❌ NO |
| **Backend API** | ❌ NO | ✅ YES (/api/rest/) |
| **Always runs** | ✅ YES (dev) | ⚠️ Optional |

### **They Don't Fallback:**

```
❌ WRONG THINKING:
"Try :4202, if not available, fallback to :4200/assets/"

✅ CORRECT THINKING:
"Step 1: Get from :4200/assets/ (mock JSON)
 Step 2: Get from :4202/api/ (backend API)
 Step 3: Merge them together (cascading)"
```

---

## 🔧 **Your Corrected URLs**

### **Development:**

```typescript
// Mock JSON (served by Angular at :4200)
const mockUrl = '/assets/data/env-config.json';  // ✅ Relative URL

// Backend API (served by json-server at :4202)
const backendUrl = 'http://localhost:4202/api/rest/env-config';  // ✅ Full URL with correct port!
```

### **Production:**

```typescript
// Mock JSON (might not exist in prod)
const mockUrl = '/assets/data/env-config.json';  // Same

// Backend API (real server)
const backendUrl = 'https://api.production.com/api/env-config';  // Real backend
```

---

## 🎉 **Thank You For The Corrections!**

**Your catches:**
1. ✅ Port is **4202** (not 4022)
2. ✅ Path is **/api/rest/** (not /rest/)
3. ✅ Mock JSON is from **:4200/assets/** (not :4202)
4. ✅ They're **separate** (not fallback)

**All fixed!** The documentation now matches your actual setup! 🎯

---

## 📚 **Related Files Updated**

1. ✅ `env-config.service.ts` - Fixed backend URL
2. ✅ `env-config.json` - Updated backend port in comments
3. ✅ `CASCADING-CONFIG-URL-STRATEGY.md` - Updated (previous version)
4. ✅ **This document** - Complete correction

---

**Document Version**: 2.0  
**Created**: 2025-01-25  
**Status**: ✅ Corrected (thanks to user!)  
**Ports**: :4200 (Angular) + :4202 (json-server)
