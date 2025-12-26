# Using App Name from Environment Config

**Status**: ✅ Environment config loading implemented  
**App Name**: Should show "BUMS" from `/assets/data/env-config.json`

---

## 🎯 **What Was Implemented**

### **1. Environment Config Service** ✅
**File**: `core/services/env-config.service.ts`

- Loads config at startup (APP_INITIALIZER)
- Falls back to mock if backend unavailable
- Provides `get()` method for synchronous access

---

### **2. Mock Configuration** ✅
**File**: `/assets/data/env-config.json`

```json
{
  "app": {
    "name": "BUMS",  // ← This replaces "BASE"!
    "title": "BUMS - Demo Environment"
  }
}
```

---

### **3. Root Component Updated** ✅
**File**: `apps.bootstrap/components/_routerOutlet/component.ts`

- Injects `EnvConfigService`
- Gets app name from config
- Sets browser title using config

**Console output:**
```
✅ Mock config loaded (skipped backend check for speed)
App name: BUMS
✅ App name from config: BUMS
```

---

## 📝 **How to Use in Components**

### **Pattern 1: In Component Class**

```typescript
import { EnvConfigService } from 'core/services/env-config.service';

@Component({ ... })
export class MyComponent implements OnInit {
  appName: string = '';
  
  constructor(private envConfig: EnvConfigService) {}
  
  ngOnInit() {
    // Wait for config to load
    this.envConfig.getConfig$().subscribe(config => {
      this.appName = config.app.name;  // "BUMS"
    });
  }
}
```

---

### **Pattern 2: In Template (via Component)**

```html
<!-- component.html -->
<h1>Welcome to {{appName}}</h1>  <!-- "Welcome to BUMS" -->
<p>{{appName}} System</p>          <!-- "BUMS System" -->
```

---

## 🔍 **Where "BASE" is Currently Hardcoded**

### **1. Landing Page Header**
**File**: `sites/features/pages/landing/_sharedparts/components/header/component.html`

**Current:**
```html
<!-- ❌ Uses hardcoded "BASE" in translation keys -->
<a class="nav-link">{{'BASE.HOMES.SINGULAR' | baseTranslate}}</a>
<a class="nav-link">{{'BASE.CAPABILITIES.PLURAL' | baseTranslate}}</a>
```

**After (Example):**
```typescript
// component.ts
export class HeaderComponent implements OnInit {
  appName: string = '';
  
  constructor(private envConfig: EnvConfigService) {}
  
  ngOnInit() {
    this.envConfig.getConfig$().subscribe(config => {
      this.appName = config.app.name;
    });
  }
}
```

```html
<!-- component.html -->
<!-- ✅ Now shows "BUMS" -->
<p>{{appName}} - Your Digital Platform</p>
```

---

### **2. Authentication Pages**
**Files:**
- `themes/t1/features/user/account/login/component.html`
- `themes/t1/features/user/account/auth/logout/basic/component.html`

**Current:**
```html
<!-- ❌ Hardcoded description -->
<p>{{this.appsConfiguration.description.description}}</p>
```

**After:**
```html
<!-- ✅ Use app name from config -->
<p>Welcome to {{appName}}</p>
```

---

### **3. Logos**
**Files:**
- `themes/t1/components.layout/topbar/logo/component.html`
- `themes/t1/components.layout/horizontal-topbar/component.html`

**Current:**
```html
<!-- Logo alt text could include app name -->
<img src="..." alt="">
```

**After:**
```html
<!-- ✅ Better accessibility -->
<img src="..." [alt]="appName + ' Logo'">  <!-- "BUMS Logo" -->
```

---

## 🚀 **Example: Update Landing Header**

### **Step 1: Update Component**

```typescript
// sites/features/pages/landing/_sharedparts/components/header/component.ts

import { EnvConfigService } from 'core/services/env-config.service';

@Component({
  selector: 'app-landing-header',
  templateUrl: './component.html'
})
export class HeaderComponent implements OnInit {
  // ✅ Add appName property
  appName: string = 'Loading...';
  
  constructor(
    private envConfig: EnvConfigService,
    // ... other services
  ) {}
  
  ngOnInit() {
    // Load app name from config
    this.envConfig.getConfig$().subscribe(config => {
      this.appName = config.app.name;  // "BUMS"
    });
    
    // ... existing code
  }
}
```

---

### **Step 2: Update Template**

```html
<!-- sites/features/pages/landing/_sharedparts/components/header/component.html -->

<nav class="navbar navbar-expand-lg navbar-landing fixed-top">
  <div class="container">
    <!-- Logo with app name -->
    <a class="navbar-brand" routerLink="/">
      <img [src]="deployed.logos.dark"
           [alt]="appName + ' Logo'"  <!-- ✅ "BUMS Logo" -->
           height="17">
    </a>
    
    <!-- Navigation -->
    <ul class="navbar-nav mx-auto">
      <li class="nav-item">
        <a class="nav-link">{{'BASE.HOMES.SINGULAR' | baseTranslate}}</a>
      </li>
      <!-- ... rest of menu -->
    </ul>
    
    <!-- CTA buttons -->
    <div>
      <a [routerLink]="nav.auth.signin" class="btn btn-link">
        Sign In to {{appName}}  <!-- ✅ "Sign In to BUMS" -->
      </a>
      <a [routerLink]="nav.auth.signup" class="btn btn-primary">
        Try {{appName}} Free  <!-- ✅ "Try BUMS Free" -->
      </a>
    </div>
  </div>
</nav>
```

---

## 📊 **Translation Keys vs. App Name**

### **When to Use Translations:**
```html
<!-- ✅ Generic labels (same across all apps) -->
{{'BASE.HOMES.SINGULAR' | baseTranslate}}  <!-- "Home" -->
{{'BASE.SIGN_INS.SINGULAR' | baseTranslate}}  <!-- "Sign In" -->
```

### **When to Use App Name:**
```html
<!-- ✅ App-specific text (changes per config) -->
<h1>Welcome to {{appName}}</h1>  <!-- "Welcome to BUMS" -->
<p>{{appName}} - Your Platform</p>  <!-- "BUMS - Your Platform" -->
```

---

## ⚠️ **Important Notes**

### **1. Wait for Config to Load**

```typescript
// ❌ BAD: Synchronous access too early
constructor(private envConfig: EnvConfigService) {
  this.appName = this.envConfig.get().app.name;  // ERROR: Config not loaded yet!
}

// ✅ GOOD: Wait for config
ngOnInit() {
  this.envConfig.getConfig$().subscribe(config => {
    this.appName = config.app.name;  // Works!
  });
}
```

---

### **2. Fallback Values**

```typescript
// ✅ Provide fallback while loading
appName: string = 'Loading...';  // Shows until config loads

// Or use default:
ngOnInit() {
  this.envConfig.getConfig$().subscribe(config => {
    this.appName = config?.app?.name || 'BASE';  // Fallback to "BASE"
  });
}
```

---

## 🧪 **How to Test**

### **1. Check Console**
Run app and check console output:
```
✅ Mock config loaded (skipped backend check for speed)
App name: BUMS
✅ App name from config: BUMS
```

### **2. Check Browser Title**
Browser tab should show: `BUMS - Demo Environment`

### **3. Update a Component**
Try updating landing header component (steps above) and verify "BUMS" appears

---

## 🎯 **Next Steps**

### **Priority 1: High-Visibility Pages**
- [ ] Landing page header
- [ ] Login page
- [ ] Logout page
- [ ] Browser title (already done ✅)

### **Priority 2: Templates**
- [ ] Replace logo alt text
- [ ] Update welcome messages
- [ ] Footer copyright

### **Priority 3: Documentation**
- [ ] Update docs to use {{appName}}
- [ ] Remove hardcoded "BASE" references

---

## 📝 **File Checklist**

**Files to Update:**
- [ ] `sites/features/pages/landing/_sharedparts/components/header/component.ts`
- [ ] `sites/features/pages/landing/_sharedparts/components/header/component.html`
- [ ] `themes/t1/features/user/account/login/component.ts`
- [ ] `themes/t1/features/user/account/login/component.html`
- [ ] `themes/t1/features/user/account/auth/logout/basic/component.ts`
- [ ] `themes/t1/features/user/account/auth/logout/basic/component.html`

**Already Done:**
- [x] `apps.bootstrap/components/_routerOutlet/component.ts` ✅
- [x] Browser title ✅

---

## 💡 **Pro Tips**

### **1. Create Shared Service**
If many components need app name, create a shared service:

```typescript
// core/services/app-info.service.ts
@Injectable({ providedIn: 'root' })
export class AppInfoService {
  private appName$ = new BehaviorSubject<string>('Loading...');
  
  constructor(private envConfig: EnvConfigService) {
    this.envConfig.getConfig$().subscribe(config => {
      this.appName$.next(config.app.name);
    });
  }
  
  getAppName(): Observable<string> {
    return this.appName$.asObservable();
  }
}
```

Then in components:
```typescript
constructor(private appInfo: AppInfoService) {}

ngOnInit() {
  this.appInfo.getAppName().subscribe(name => {
    this.appName = name;  // "BUMS"
  });
}
```

---

### **2. Create Pipe**
Or create a pipe for templates:

```typescript
// core/pipes/app-name.pipe.ts
@Pipe({ name: 'appName' })
export class AppNamePipe implements PipeTransform {
  constructor(private envConfig: EnvConfigService) {}
  
  transform(prefix: string = ''): string {
    const config = this.envConfig.get();
    return prefix + config.app.name;
  }
}
```

Then in templates:
```html
<h1>Welcome to {{'' | appName}}</h1>  <!-- "Welcome to BUMS" -->
<p>{{'Try ' | appName}} Free</p>       <!-- "Try BUMS Free" -->
```

---

**Status**: Configuration loading works, app name available  
**Next**: Update components to use `{{appName}}` instead of hardcoded "BASE"  
**Test**: Console should show "App name: BUMS"
