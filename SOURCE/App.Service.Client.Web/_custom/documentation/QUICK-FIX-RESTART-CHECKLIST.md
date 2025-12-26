# 🔧 QUICK FIX CHECKLIST - CORS Error

**Status**: ⚠️ Still seeing CORS error  
**Cause**: Angular dev server not restarted after fix

---

## ✅ **What Was Fixed**

Changed in `env-config.service.ts`:

**Before (Causes CORS):**
```typescript
const backendUrl = 'http://localhost:4202/api/rest/env-config';  // ❌ Full URL
```

**After (No CORS):**
```typescript
const backendUrl = '/api/rest/env-config';  // ✅ Relative URL (proxy handles it)
```

---

## 🎯 **RESTART STEPS** (CRITICAL!)

### **Step 1: Stop Angular Dev Server**

In Visual Studio:
1. Open **Terminal** (View → Terminal)
2. Press **Ctrl+C** to stop server
3. Wait for "Terminated" message

**OR** In PowerShell:
```powershell
# Find and kill ng serve process
Get-Process -Name "node" | Where-Object {$_.CommandLine -like "*ng serve*"} | Stop-Process -Force
```

### **Step 2: Clear Browser Cache**

In Chrome/Edge:
1. Press **Ctrl+Shift+Delete**
2. Select "Cached images and files"
3. Click "Clear data"

**OR** Hard refresh:
```
Ctrl+F5  (Windows)
Cmd+Shift+R  (Mac)
```

### **Step 3: Restart Angular Dev Server**

```powershell
cd Z:\S\Unsynced\REPOS\BASE.Client.Themed\SOURCE\App.Service.Client.Web
npm run start
```

### **Step 4: Wait for Compilation**

Look for:
```
✔ Compiled successfully.
✔ Browser application bundle generation complete.
```

### **Step 5: Open Fresh Browser Tab**

Don't reuse old tab! Open new one:
```
http://localhost:4200
```

---

## 🔍 **Verify Fix Worked**

### **Check 1: Console Logs**

You should see:
```
🔄 [EnvConfig] Initializing cascading configuration...
📦 [EnvConfig] Deployed config loaded (fallback)
   App name: BASE-DEV
📄 [EnvConfig] Mock JSON loaded (overridden)
   App name: BOOM!
⚠️ [EnvConfig] Backend API not available (using mock/deployed)
   Tried: /api/rest/env-config
✅ [EnvConfig] Cascading configuration complete!
   Final app name: BOOM!
```

### **Check 2: No CORS Errors**

You should **NOT** see:
```
❌ Connecting to 'http://localhost:4200/.well-known/...'
❌ violates the following Content Security Policy directive
```

### **Check 3: Network Tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for:
   - ✅ `GET /assets/data/env-config.json` → 200 OK
   - ⚠️ `GET /api/rest/env-config` → 404 (OK if json-server not running)

### **Check 4: Title**

Browser tab title should show:
```
BOOM! - BOOM! - Runtime Config Test
```

(Not "BASE" or "Loading...")

---

## 🚨 **If Still Not Working**

### **Check 1: File Saved?**

Verify `env-config.service.ts` has the change:
```powershell
Get-Content "App.Service.Client.Web\src\core\services\env-config.service.ts" | Select-String "'/api/rest/env-config'"
```

Should output:
```
: '/api/rest/env-config';  // ✅ Dev: Relative URL
```

If it shows `'http://localhost:4202/api/rest/env-config'` then **file wasn't saved!**

### **Check 2: Server Actually Restarted?**

```powershell
# Check if ng serve is running
Get-Process -Name "node" | Where-Object {$_.CommandLine -like "*ng*"}
```

If you see multiple node processes, **kill them all:**
```powershell
Get-Process -Name "node" | Stop-Process -Force
```

Then start fresh:
```powershell
npm run start
```

### **Check 3: Proxy Config Loaded?**

When server starts, you should see:
```
[HPM] Proxy created: /api/**  -> http://localhost:4202
```

If you don't see this, proxy isn't loading!

---

## 🎯 **Alternative: Full Reset**

If nothing works, nuclear option:

```powershell
# 1. Kill all node processes
Get-Process -Name "node" | Stop-Process -Force

# 2. Clear npm cache
npm cache clean --force

# 3. Delete node_modules and reinstall (SLOW!)
Remove-Item -Recurse -Force node_modules
npm install

# 4. Start server
npm run start
```

---

## 📊 **Current Status**

Based on your screenshot:

| Check | Status | Expected | Actual |
|-------|--------|----------|--------|
| **Server restarted** | ❌ NO | Fresh logs | Old cached logs |
| **CORS error** | ❌ YES | None | Still showing |
| **Config loaded** | ❌ NO | "BOOM!" | Not seeing logs |
| **Title changed** | ❌ NO | "BOOM!" | Still "BASE" |

**Conclusion:** Server not restarted or browser cache not cleared.

---

## 🎯 **Do This Now**

1. **In VS Code Terminal:**
   ```
   Ctrl+C (stop server)
   npm run start (restart)
   ```

2. **Wait for:**
   ```
   ✔ Compiled successfully
   ```

3. **In Browser:**
   ```
   Ctrl+F5 (hard refresh)
   ```

4. **Check console for:**
   ```
   [EnvConfig] messages
   ```

---

**If you've done all this and still see the error, send me:**
1. Screenshot of terminal showing server start
2. Screenshot of browser console
3. Screenshot of Network tab (F12 → Network)

---

## Common Issues & Fixes

### TS2792: Cannot find module '@angular/core' (or similar)

**Symptom**: TypeScript Language Service can't find installed packages

**Causes**:
- Language Service cache out of sync with `node_modules`
- VS analyzing temp files during hot reload
- `node_modules` not fully loaded when VS opened

**Fix**:
1. Verify packages exist: Check `node_modules/@angular/core` exists
2. Restart TypeScript Language Service:
   - View → Other Windows → Error List
   - Right-click errors → "Restart TypeScript/JavaScript Language Service"
3. If that doesn't work: Close and reopen Visual Studio
4. Last resort: Delete `node_modules`, run `npm install --legacy-peer-deps`

**Note**: These errors appear in the Error List but don't block actual compilation/runtime.

---

**Document Version**: 1.0  
**Created**: 2025-01-25  
**Status**: ⚠️ Awaiting restart  
**Next**: Stop server, restart, hard refresh browser
