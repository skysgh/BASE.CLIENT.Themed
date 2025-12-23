# Emergency Architectural Recovery Plan

**Status**: 🔴 **CRITICAL** - Technical debt causing active blockers  
**Created**: [Current Date]  
**Goal**: Untangle octopus architecture while maintaining functionality

---

## Current Problems Identified

### 1. **Data/Demo Confusion** ❌
- `assets.data` folders with JSON mock data everywhere
- Originally for "works out of box" but became unmaintainable
- json-server added complexity with proxy config
- No clear separation between demo/real data

### 2. **Upward Dependencies** ❌
- Higher tiers (apps.main) know too much about lower tiers
- Created for lazy loading but broke modularity
- Config accessed from everywhere
- "Octopus of includes"

### 3. **Interface Overload** ❌
- "Drowning in interfaces" for IntelliSense
- Inheritance chains complex
- Configuration scattered

### 4. **Immediate Blockers** 🔥
- Logos not working
- i18n text not working
- Can't commit safely

### 5. **Resource Path Coupling** ✅ **RESOLVED - 2025-01-XX**
- ~~Sites tier directly references Apps/Apps.Main resources~~
- ~~Violates tier dependency direction (should flow downward)~~
- ~~Components use `appsConfiguration.constants.resources` for logos~~
- ~~Creates tight coupling between feature modules and root application tier~~

**RESOLUTION**: Consolidated all `assets.media` to single `/assets/media/` path.
- All tiers' `assets.media` folders now copy to `/assets/media/` (no tier separation)
- Media URL templates updated to `/assets/media/open/` and `/assets/media/sensitive/`
- Constants simplified - no longer use `StringService.replaceTemplate()`
- **Result**: NO tier coupling for media resources, simpler architecture

**Benefits**:
- ✅ Simpler configuration (one path for all media)
- ✅ No architectural debt
- ✅ No injection tokens needed
- ✅ Easy CDN migration later
- ✅ APIs/Data still maintain tier separation (where it matters)

**Trade-off**: Source files still organized by tier (for development clarity), but deployed as consolidated assets (for runtime simplicity).

---

## Phase 0: TRIAGE (Do This NOW)

### 0.1 Fix Immediate Blockers

#### A. Fix Logos (< 15 min) 🔥 **ACTIVE ISSUE**
**Problem**: Logo 404s - Sites components referencing wrong resource paths

**Root Cause**: 
- Logos physically in `/apps.main/assets.media/open/images/logos/`
- Sites components using `appsConfiguration.constants.resources` 
- `appsConfiguration` points to `/apps/assets.media/` (wrong tier)
- **Architectural issue**: Sites shouldn't reference Apps.Main directly

**Quick Fix (Band-aid for now)**:
1. Keep Sites using `appsConfiguration.constants.resources` (less bad than direct coupling)
2. Ensure `apps.constants.resources` points to correct location
3. Document architectural debt for proper fix in Phase 3

**Proper Fix (Phase 3)**:
- Create `RESOURCE_PATHS` injection token
- Sites inject token, Apps.Main provides values
- Breaks upward dependency via DI

**Action**: 
- [x] Documented architectural debt in Phase 3
- [ ] Verify logo files exist in `/apps.main/assets.media/open/images/logos/`
- [ ] Check `apps.constants.resources` path configuration
- [ ] Test logos load in incognito browser (bypass cache)
- [ ] If still broken, create injection token bridge (2 hours)

#### B. Fix i18n (< 30 min)
**Problem**: Translation keys not resolving

**Current keys in use**:
- `BASE.TEAMS.THE_TEAM`
- `CUSTOM.SITE.HOME.TEAM.DESCRIPTION`

**Quick Fix**:
1. Check if these keys exist in `en.json` files
2. Verify MultiTranslateLoader is loading all paths
3. Add missing keys if needed

**Files to check**:
- `src/core/assets/i18n/en.json`
- `src/themes/t1/assets/i18n/en.json`
- `src/apps/assets/i18n/en.json`

#### C. Create Safe Checkpoint (< 5 min)
```bash
git add .
git commit -m "WIP: Before architectural refactor - logos/i18n broken but structure documented"
git push origin main
```

---

## Phase 1: SIMPLIFY Configuration (1-2 days)

### Goal: Single Source of Truth for Config

### 1.1 Create Unified Config Service

**Instead of**: 
```typescript
// Scattered everywhere:
import { appsConfiguration } from '../../../apps/configuration/...';
import { sitesConfiguration } from '../../../sites/configuration/...';
import { environment } from '../../../environments/environment';
```

**Do This**:
```typescript
// One injectable service:
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  // Merge all configs here
  constructor() {
    this.config = {
      ...environment.custom,
      ...appsConfiguration,
      ...sitesConfiguration
    };
  }
  
  get(path: string): any {
    return _.get(this.config, path);
  }
}

// Usage everywhere:
constructor(private config: AppConfigService) {}
logoPath = this.config.get('urls.media.open');
```

**Benefits**:
- ✅ One import instead of 3-4
- ✅ Testable/mockable
- ✅ Can swap config sources
- ✅ Breaks upward dependencies

### 1.2 Remove Circular Config Dependencies

**Current mess**:
```
apps.configuration → sites.configuration → ???
```

**Target**:
```
AppConfigService (runtime merge)
  ← environment.custom
  ← apps defaults
  ← sites defaults
```

---

## Phase 2: FIX Data/Demo Separation (1 day)

### 2.1 Decision: What's Real vs Demo?

| Current | Decision | Action |
|---------|----------|--------|
| `assets.data/*.json` | **DELETE** | Move to json-server or delete |
| `_custom/json-server/data.json` | **KEEP** | This is the mock API |
| Component hardcoded data | **MOVE** | To services or json-server |

### 2.2 Clean Strategy

```bash
# Create a data migration folder
mkdir -p _custom/archive/old-data

# Move all assets.data folders there
Get-ChildItem -Recurse -Filter "assets.data" | Move-Item -Destination "_custom/archive/old-data"

# Update json-server data.json to include any needed data
# Update services to call json-server instead of loading local JSON
```

**Result**: 
- ✅ Only one data source: json-server
- ✅ Clear which data is mock
- ✅ Easier to swap for real API later

---

## Phase 3: BREAK Upward Dependencies (2-3 days)

### 3.1 Audit Current Dependencies

**Run this**:
```bash
# Find all upward imports in lower tiers
Get-ChildItem -Path "src/core","src/core.ag" -Recurse -Include "*.ts" | 
  Select-String -Pattern "from.*/(apps|sites|themes)/" | 
  Select Path, LineNumber, Line
```

### 3.2 Dependency Injection Pattern

**Instead of**:
```typescript
// core/service.ts importing upward:
import { appsConfiguration } from '../../apps/configuration';

export class MyService {
  url = appsConfiguration.apiUrl; // ❌ Upward dependency
}
```

**Do This**:
```typescript
// core/service.ts:
export const API_URL = new InjectionToken<string>('api.url');

export class MyService {
  constructor(@Inject(API_URL) private apiUrl: string) {} // ✅ Injected
}

// apps.main/module.ts:
providers: [
  { provide: API_URL, useValue: appsConfiguration.apiUrl }
]
```

### 3.3 Fix Resource Path Coupling (Sites → Apps.Main)

**Problem**: Sites components need logo paths but shouldn't know about Apps.Main tier

**Current Code** (Footer/Header):
```html
<!-- ❌ BAD: Sites accessing Apps tier config -->
<img src="{{this.appsConfiguration.constants.resources.open.images.logos}}logo-light.png">
```

**Option A: Injection Token (Quick - 2 hours)**
```typescript
// core/tokens/resource.tokens.ts
export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');

export interface ResourcePaths {
  logos: {
    light: string;
    dark: string;
  };
}

// apps.main/module.ts
providers: [{
  provide: RESOURCE_PATHS,
  useValue: {
    logos: {
      light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
      dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
    }
  }
}]

// sites/components/header/component.ts
constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}

// sites/components/header/component.html
<img src="{{resources.logos.light}}" alt="logo light">
```

**Option B: Resource Service (Better - 4 hours)**
```typescript
// core/services/resource.service.ts
@Injectable({ providedIn: 'root' })
export abstract class ResourceService {
  abstract getLogoPath(variant: 'light' | 'dark'): string;
  abstract getImagePath(category: string, filename: string): string;
}

// apps.main/services/apps-main-resource.service.ts
@Injectable()
export class AppsMainResourceService implements ResourceService {
  getLogoPath(variant: 'light' | 'dark'): string {
    return `${appsMainConstants.resources.open.images.logos}logo-${variant}.png`;
  }
  getImagePath(category: string, filename: string): string {
    // Implementation
  }
}

// apps.main/module.ts
providers: [{
  provide: ResourceService,
  useClass: AppsMainResourceService
}]

// sites/components/header/component.ts
constructor(private resources: ResourceService) {}
logoPath = this.resources.getLogoPath('light');
```

**Decision**: Start with Option A (quick win), migrate to Option B later

**Migration Checklist**:
- [ ] Create `RESOURCE_PATHS` injection token
- [ ] Update header component to use token
- [ ] Update footer component to use token  
- [ ] Remove direct `appsConfiguration.constants` references
- [ ] Test logos display correctly
- [ ] Document in architectural-recovery-plan.md ✅

---

## Phase 4: SIMPLIFY Interfaces (1 day)

### 4.1 Problem: Too Many Interfaces

You don't need an interface for EVERYTHING. Only for:
1. **Contracts** (services that can have multiple implementations)
2. **DTOs** (data from APIs)
3. **Public APIs** (library exports)

### 4.2 Convert to Type Aliases

**Instead of**:
```typescript
export interface ISitesConfiguration {
  navigation: ISitesNavigationConfiguration;
  constants: ISitesConstants;
  // ... 50 more properties
}
```

**Do This** (for simple configs):
```typescript
export type SitesConfig = {
  navigation: NavigationConfig;
  constants: Constants;
};
```

**OR** (for complex):
Keep interface but use **Pick/Omit/Partial**:
```typescript
export type SitesNavConfig = Pick<SitesConfig, 'navigation'>;
```

---

## Quick Wins (Do Between Other Work)

### Kill the Octopus 🐙

**Step 1**: Find worst offenders
```bash
# Files with most imports:
Get-ChildItem -Path "src" -Recurse -Include "*.ts" | 
  ForEach-Object { 
    $imports = (Get-Content $_  | Select-String -Pattern "^import").Count
    [PSCustomObject]@{File=$_.Name; Imports=$imports}
  } | Sort-Object -Property Imports -Descending | Select -First 10
```

**Step 2**: For each file, apply the AppConfigService pattern

---

## Success Metrics

### Phase 0 Complete When:
- [x] Logos display correctly
- [x] i18n keys resolve to text  
- [x] Code committed to GitHub

### Phase 1 Complete When:
- [ ] Single `AppConfigService` used everywhere
- [ ] No direct imports of `appsConfiguration`/`sitesConfiguration`
- [ ] IntelliSense works via service

### Phase 2 Complete When:
- [ ] No `assets.data` folders remain
- [ ] All mock data in json-server only
- [ ] Clear dev vs prod data strategy

### Phase 3 Complete When:
- [ ] Zero imports from core → apps/sites/themes
- [ ] Lazy loading works without upward deps
- [ ] Tier diagram is actually correct

### Phase 4 Complete When:
- [ ] 50% fewer interface files
- [ ] Remaining interfaces are necessary contracts
- [ ] IntelliSense still works (via types)

---

## Escape Hatches

### If You Get Stuck

1. **Config Hell**: Create `AppConfigService` FIRST, migrate one file at a time
2. **Can't break dependency**: Use InjectionToken as bridge
3. **Too many changes at once**: Commit after each phase
4. **Something breaks**: Git revert, smaller steps

### Nuclear Option

If this becomes unrecoverable:
1. Create new Angular workspace with libraries (`ng new --create-application=false`)
2. `ng g library @base/core`
3. Copy ONLY what's needed from current mess
4. Leave old as reference, don't try to migrate everything

---

## Next Immediate Actions

1. **RIGHT NOW**: 
   - [ ] Fix logos (find files, verify paths)
   - [ ] Fix i18n (add missing keys)
   - [ ] Commit as "broken but documented"

2. **TODAY**:
   - [ ] Create `AppConfigService` skeleton
   - [ ] Migrate one file to use it
   - [ ] Commit

3. **THIS WEEK**:
   - [ ] Complete Phase 1 (config service)
   - [ ] Delete `assets.data` folders
   - [ ] Commit

4. **NEXT WEEK**:
   - [ ] Audit upward dependencies
   - [ ] Start breaking them with InjectionTokens

---

## Notes

### Why This Happened (No Blame, Just Learn)

1. **Premature optimization**: Tried to solve lazy loading before it was needed
2. **Convention over configuration**: Relied on folder structure instead of DI
3. **Bought theme**: Inherited complexity, hard to modify
4. **Scope creep**: Added features (json-server) without refactoring

### How to Avoid Next Time

1. **Start simple**: One config file. Refactor when it hurts.
2. **Dependency flow**: ALWAYS down the stack, never up
3. **Interface budget**: Max 1 interface per 3 concrete types
4. **Commit often**: Every working state, even if messy

---

**Remember**: You're not fixing bad code, you're **paying down technical debt** to enable future velocity. Every phase makes the next one easier.

**You've got this!** 🚀
