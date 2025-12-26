# Manual Steps: Rename apps.main → apps.bootstrap

**Issue**: Folder is locked by Visual Studio  
**Solution**: Close VS, rename manually, update references, reopen

---

## 📋 Step-by-Step Instructions

### **Step 1: Close Visual Studio**
1. **Save all open files** (Ctrl+Shift+S)
2. **Close Visual Studio completely**
3. Wait a few seconds for file locks to release

---

### **Step 2: Rename Folder (Windows Explorer)**

**Navigate to:**
```
Z:\S\Unsynced\REPOS\BASE.Client.Themed\SOURCE\App.Service.Client.Web\src\
```

**Rename:**
- **From**: `apps.main`
- **To**: `apps.bootstrap`

**Method:**
- Right-click → Rename
- Or press F2

---

### **Step 3: Update References**

After renaming, Visual Studio will show errors. Update these files:

#### **A. Update main.ts**

**File**: `src/main.ts`

**Change Line 6:**
```typescript
// Before:
import { AppModule } from './apps.main/module';

// After:
import { AppModule } from './apps.bootstrap/module';
```

---

#### **B. Update angular.json**

**File**: `angular.json`

**Find and replace ALL instances:**
- **Find**: `apps.main`
- **Replace**: `apps.bootstrap`

**Expected locations:**
- `projects.App.Service.Client.Web.architect.build.options.main`
- `projects.App.Service.Client.Web.architect.build.options.polyfills`
- Any other references in build configuration

---

#### **C. Update Documentation References**

**Files to check:**
- `_custom/documentation/IMPLEMENTATION-COMPLETE-GUIDE.md`
- `_custom/documentation/MILESTONE-SECURITY-ARCHITECTURE-COMPLETE.md`
- `_custom/documentation/SESSION-SUMMARY-SECURITY-SPLIT.md`
- `_custom/documentation/adr/ADR-001-token-based-dependency-injection.md`

**Find and replace:**
- `apps.main` → `apps.bootstrap`

---

### **Step 4: Search for Remaining References**

**Use Visual Studio "Find in Files" (Ctrl+Shift+F):**

1. Search for: `apps.main`
2. Scope: Entire Solution
3. Replace all with: `apps.bootstrap`

**Common locations:**
- Import statements
- Comments
- Documentation
- Configuration files

---

### **Step 5: Verify Build**

1. **Reopen Visual Studio**
2. **Reload Solution** (if prompted)
3. **Build** (Ctrl+Shift+B)
4. **Check for errors**

**Expected result:** ✅ Build successful with 0 errors

---

## 🔍 **Quick Reference: Files That Need Updates**

| File | Line/Section | Change |
|------|--------------|--------|
| `src/main.ts` | Line 6 | Import path |
| `angular.json` | Multiple | Build config paths |
| Documentation | Multiple | References in docs |

---

## ⚠️ **Troubleshooting**

### **Problem: "Cannot find module './apps.main/module'"**
**Solution**: Check that `main.ts` import is updated to `apps.bootstrap`

### **Problem: Build errors after rename**
**Solution**: 
1. Clean solution (Build → Clean Solution)
2. Delete `node_modules/.cache` folder
3. Rebuild (Ctrl+Shift+B)

### **Problem: Visual Studio shows old folder name**
**Solution**:
1. Close VS
2. Delete `.vs` folder (hidden folder in solution root)
3. Reopen VS

---

## ✅ **Verification Checklist**

After completing all steps:

- [ ] Folder renamed in Windows Explorer
- [ ] `main.ts` import updated
- [ ] `angular.json` references updated
- [ ] Documentation updated
- [ ] No remaining `apps.main` references (search confirms)
- [ ] Build successful (0 errors)
- [ ] App runs (`ng serve` or F5)

---

## 🚀 **After Successful Rename**

**Commit to Git:**
```powershell
git add .
git commit -m "refactor: Rename apps.main to apps.bootstrap

- Clarifies folder purpose (bootstrap/orchestration)
- Updated all references in main.ts, angular.json
- Updated documentation
- Build verified successful"
```

---

**Estimated Time**: 5-10 minutes  
**Difficulty**: Easy (just renaming + find/replace)  
**Risk**: Low (can revert with Git if issues)

---

**Next Steps After This:**
1. ✅ Rename complete
2. Consider numbering folders (1.core, 2.core.ag, etc.)
3. Create root routing module
4. Separate public/private tiers

**Status**: Ready to execute - just close VS and rename! 🎯
