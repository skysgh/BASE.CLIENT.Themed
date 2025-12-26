# 💡 json-server --static Flag Discovery

**Date**: 2025-01-25  
**Status**: ✅ **Discovered & Documented**  
**Impact**: Simplifies backend simulation setup

---

## 🎯 **The Discovery**

**json-server can serve BOTH API endpoints AND static files!**

```bash
json-server --static <path> data.json
```

**This means:**
- One server (:4202) serves API + assets
- No need for Angular dev server just for assets
- Simpler deployment for demos

---

## 📊 **Before vs After**

### **Before (Two Servers):**

```
Angular Dev Server (:4200)
├─ Serves: Angular app
├─ Serves: /assets/ folder
└─ HMR + Live reload

json-server (:4202)
├─ Serves: API endpoints
└─ Mock data
```

**Usage:**
```bash
# Terminal 1:
npm run start  # Angular at :4200

# Terminal 2:
npm run json-server  # API at :4202
```

---

### **After (Single Server Option):**

```
json-server (:4202) with --static
├─ Serves: API endpoints
├─ Serves: /assets/ folder (from --static)
└─ Mock data + static files

Angular Dev Server (:4200) - Still needed for:
├─ Live reload
├─ HMR (Hot Module Replacement)
└─ Development features
```

**Usage:**
```bash
# For development (still use Angular):
npm run start-local-json-server

# For testing backend simulation only:
npm run json-server:with-static
# Then open: http://localhost:4202/assets/data/env-config.json
```

---

## 🚀 **New npm Scripts**

### **1. Basic json-server (Existing):**

```json
{
  "json-server": "json-server --port=4202 --routes=_custom/json-server/routes.json _custom/json-server/data.json"
}
```

**Serves:**
- ✅ API endpoints: `http://localhost:4202/api/rest/*`
- ❌ Static files: Not available

---

### **2. json-server with Static Files (New!):**

```json
{
  "json-server:with-static": "json-server --port=4202 --routes=_custom/json-server/routes.json --static src/assets _custom/json-server/data.json"
}
```

**Serves:**
- ✅ API endpoints: `http://localhost:4202/api/rest/*`
- ✅ Static files: `http://localhost:4202/assets/*`

**Example:**
```bash
npm run json-server:with-static

# Now accessible:
http://localhost:4202/api/rest/env-config  ← Backend API
http://localhost:4202/assets/data/env-config.json  ← Static file!
```

---

### **3. Concurrent Start with Static (New!):**

```json
{
  "start-local-json-server-with-static": "concurrently --kill-others-on-fail \"npm run json-server:with-static\" \"npm run start\""
}
```

**Runs:**
- Angular at :4200 (with HMR, live reload)
- json-server at :4202 (with API + assets)

---

## 💡 **Use Cases**

### **Use Case 1: Full Backend Simulation**

**Scenario:** Test both backend API and asset serving without Angular

```bash
npm run json-server:with-static

# Test:
curl http://localhost:4202/api/rest/env-config  # Backend API
curl http://localhost:4202/assets/data/env-config.json  # Static asset
```

**Benefits:**
- Single server
- Simpler setup
- Good for demos

---

### **Use Case 2: Deployment Simulation**

**Scenario:** Simulate production environment locally

```bash
# Build Angular app:
npm run build

# Serve built app + API from same server:
json-server --port=4202 --static dist/base --routes=_custom/json-server/routes.json _custom/json-server/data.json

# Access:
http://localhost:4202/  ← Built Angular app
http://localhost:4202/api/rest/*  ← API
http://localhost:4202/assets/*  ← Static assets
```

**Benefits:**
- Production-like environment
- Single deployment target
- Test CDN fallback logic

---

### **Use Case 3: CI/CD Testing**

**Scenario:** E2E tests without Angular dev server

```bash
# In CI pipeline:
npm run build
json-server --port=4202 --static dist/base data.json &
npm run test:e2e
```

**Benefits:**
- Faster than Angular serve
- More production-like
- No webpack overhead

---

## ⚠️ **When NOT to Use**

### **Development:**

**Don't use for active development:**
```bash
# ❌ BAD (no live reload, no HMR):
npm run json-server:with-static

# ✅ GOOD (live reload + HMR):
npm run start-local-json-server
```

**Why:**
- No live reload (must refresh manually)
- No HMR (full page reload)
- No TypeScript compilation on save

---

### **Production:**

**Don't use for production:**
```bash
# ❌ BAD (json-server is for mocking!):
json-server --static dist/base data.json

# ✅ GOOD (use proper servers):
# - Static assets: CDN (Cloudflare, AWS S3)
# - API: Real backend (Node.js, .NET, etc.)
```

**Why:**
- json-server is not production-ready
- No caching headers
- No HTTPS
- No load balancing
- No security features

---

## 📝 **Configuration Examples**

### **Example 1: Basic Static Serve**

```bash
json-server --static ./public data.json
```

**Result:**
- API: `http://localhost:3000/*` (from data.json)
- Static: `http://localhost:3000/*` (from ./public)

---

### **Example 2: With Port and Routes**

```bash
json-server --port=4202 --static src/assets --routes=routes.json data.json
```

**Result:**
- API: `http://localhost:4202/api/rest/*` (routes applied)
- Static: `http://localhost:4202/assets/*` (from src/assets)

---

### **Example 3: Multiple Static Folders**

```bash
json-server --static src/assets --static dist/images data.json
```

**Result:**
- `http://localhost:3000/*` (from src/assets)
- `http://localhost:3000/*` (from dist/images)
- Both folders served at root

---

## 🎯 **Your Setup**

### **Current Setup:**

```
Angular (:4200)          json-server (:4202)
├─ App                   ├─ API: /api/rest/*
├─ /assets/              └─ From: data.json
└─ HMR + Live reload
```

### **With --static:**

```
Angular (:4200)          json-server (:4202) + --static
├─ App                   ├─ API: /api/rest/*
├─ /assets/              ├─ Assets: /assets/*  ← NEW!
└─ HMR + Live reload     └─ From: data.json + src/assets
```

---

## 🧪 **Testing Scenarios**

### **Test 1: Assets Served by json-server**

```bash
# Start json-server with static:
npm run json-server:with-static

# Test in browser:
http://localhost:4202/assets/data/env-config.json

# Should see:
{
  "app": {
    "name": "BOOM!"
  }
}
```

---

### **Test 2: Both Angular and json-server**

```bash
# Start both:
npm run start-local-json-server-with-static

# Test Angular serving assets:
http://localhost:4200/assets/data/env-config.json  ← Angular serves

# Test json-server serving assets:
http://localhost:4202/assets/data/env-config.json  ← json-server serves

# Both should return same content!
```

---

### **Test 3: Cascading Config with Static**

**Update env-config.service.ts to support both:**

```typescript
// Try Angular first (development):
const mockUrl = '/assets/data/env-config.json';  // ← :4200/assets/

// Try json-server if Angular not available:
const fallbackUrl = 'http://localhost:4202/assets/data/env-config.json';  // ← :4202/assets/

try {
  const config = await this.http.get(mockUrl).toPromise();
} catch {
  // Fallback to json-server static serve
  const config = await this.http.get(fallbackUrl).toPromise();
}
```

---

## 🎯 **Summary**

| Aspect | Without --static | With --static |
|--------|-----------------|---------------|
| **API endpoints** | ✅ YES | ✅ YES |
| **Static files** | ❌ NO | ✅ YES |
| **Port** | :4202 | :4202 |
| **Use case** | API mocking | API + assets |
| **Development** | ⚠️ Need Angular | ⚠️ Still need Angular (HMR) |
| **Testing** | ✅ Good | ✅ Better |
| **Production** | ❌ NO | ❌ NO |

---

## 💡 **Key Insights**

### **What This Enables:**

1. **Single-Server Demos:**
   - No need to explain "run two servers"
   - Simpler setup for demos

2. **Backend Simulation:**
   - Test how app works with real backend structure
   - Simulate CDN behavior

3. **Fallback Strategy:**
   - If Angular serve fails, json-server still has assets
   - Redundancy for critical files

### **What This Doesn't Replace:**

1. **Angular Dev Server:**
   - Still need HMR for development
   - Still need live reload
   - Still need TypeScript compilation

2. **Production CDN:**
   - json-server is NOT for production
   - Use real CDN (Cloudflare, AWS S3)
   - json-server has no caching, HTTPS, etc.

---

## 🚀 **Recommended Usage**

### **For Development:**
```bash
npm run start-local-json-server  # Angular + json-server (API only)
```

### **For Testing Backend Simulation:**
```bash
npm run start-local-json-server-with-static  # Both serve assets
```

### **For Demos:**
```bash
npm run build
json-server --port=4202 --static dist/base data.json
```

---

## 📚 **References**

- json-server docs: https://github.com/typicode/json-server
- `--static` flag: Serves static files from specified directory
- Your setup: See `package.json` scripts

---

**🎉 Great discovery!** This simplifies backend simulation significantly! 🎯

---

**Document Version**: 1.0  
**Created**: 2025-01-25  
**Status**: ✅ Documented  
**Impact**: Medium (improves testing workflow)
