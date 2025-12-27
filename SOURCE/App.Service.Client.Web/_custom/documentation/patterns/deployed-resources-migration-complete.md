# DEPLOYED_RESOURCES Migration Complete

**Date**: 2025-12-27  
**Status**: ✅ Complete  
**Pattern**: AccountService for Multi-Account Branding

---

## Summary

**✅ COMPLETED:** All components migrated from `DEPLOYED_RESOURCES` injection token to `AccountService` for reactive multi-account branding support.

---

## What Changed

### Before (Static DI Token):
```typescript
// Component used hardcoded paths via injection token
constructor(@Inject(DEPLOYED_RESOURCES) public deployed: DeployedResourcePaths) {}
```
```html
<!-- Template used static paths -->
<img [src]="deployed.logos.light" alt="Logo">
```

**Problems:**
- ❌ Hardcoded paths from `sitesConstants`
- ❌ Not reactive (couldn't change per account)
- ❌ Required token provider setup in module
- ❌ No multi-account support

---

### After (Reactive AccountService):
```typescript
// Component uses AccountService observables
export class HeaderComponent {
  public logoLight$: Observable<string | undefined>;
  
  constructor(private accountService: AccountService) {
    this.logoLight$ = this.accountService.getConfigValue('branding.logoDark');
  }
}
```
```html
<!-- Template uses async pipe -->
<img *ngIf="logoLight$ | async as logo" [src]="logo" alt="Logo">
```

**Benefits:**
- ✅ Reactive (updates when account changes)
- ✅ Multi-account ready (`/foo/pages` → FOO logo)
- ✅ No token provider needed
- ✅ Single source of truth (account config files)
- ✅ Type-safe with full intellisense

---

## Components Migrated

| Component | Path | Status |
|-----------|------|--------|
| Landing Header | `sites.anon/features/pages/landing/_sharedparts/components/header/` | ✅ |
| Sites Footer | `sites.anon/features/pages/information/components/index/components/footer/` | ✅ |
| Themes Footer | `themes/t1/components.layout/footer/` | ✅ |
| Sidebar | `themes/t1/components.layout/sidebar/` | ✅ |
| Topbar Logo | `themes/t1/components.layout/topbar/logo/` | ✅ |
| Horizontal Topbar | `themes/t1/components.layout/horizontal-topbar/` | ✅ |
| Two-Column Sidebar | `themes/t1/components.layout/two-column-sidebar/` | ✅ |
| Login | `themes/t1/features/user/account/login/` | ✅ |
| Signin Basic | `themes/t1/features/user/account/auth/signin/basic/` | ✅ |
| Success-Msg Basic | `themes/t1/features/user/account/auth/success-msg/basic/` | ✅ |
| Success-Msg Cover | `themes/t1/features/user/account/auth/success-msg/cover/` | ✅ |

---

## Pattern for Future Components

### TypeScript:
```typescript
import { Observable } from 'rxjs';
import { AccountService } from 'path/to/account.service';

export class YourComponent {
  // ✅ Create observable properties
  public logo$: Observable<string | undefined>;
  public logoDark$: Observable<string | undefined>;
  public logoSm$: Observable<string | undefined>;
  public title$: Observable<string | undefined>;
  public description$: Observable<string | undefined>;
  
  constructor(private accountService: AccountService) {
    // ✅ Get values from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.logoDark$ = this.accountService.getConfigValue('branding.logoDark');
    this.logoSm$ = this.accountService.getConfigValue('branding.logoSm');
    this.title$ = this.accountService.getConfigValue('title');
    this.description$ = this.accountService.getConfigValue('description');
  }
}
```

### Template:
```html
<!-- ✅ Use async pipe with *ngIf for safety -->
<img *ngIf="logo$ | async as logo" [src]="logo" alt="">
<h1 *ngIf="title$ | async as title">{{title | baseTranslate}}</h1>
<p *ngIf="description$ | async as desc">{{desc | baseTranslate}}</p>
```

---

## Account Config Structure

```json
{
  "accountId": "default",
  "name": "Default Account",
  "title": "BASE.ACCOUNTS.DEFAULT.TITLE",
  "subtitle": "BASE.ACCOUNTS.DEFAULT.SUBTITLE",
  "description": "BASE.ACCOUNTS.DEFAULT.DESCRIPTION",
  "branding": {
    "logo": "/assets/core/media/open/accounts/default/logo-dark.svg",
    "logoDark": "/assets/core/media/open/accounts/default/logo-dark.svg",
    "logoSm": "/assets/core/media/open/accounts/default/logo-sm.png",
    "theme": {
      "primaryColor": "#007bff",
      "secondaryColor": "#6c757d",
      "accentColor": "#28a745"
    }
  }
}
```

---

## Testing

### Test all account scenarios:

| URL | Expected Logo | Expected Title |
|-----|--------------|----------------|
| `/pages` | Default logo | Default Account |
| `/foo/pages` | FOO logo | FOO Corporation |
| `/bar/pages` | BAR logo | BAR Enterprises |
| `/foot/pages` | 404-A error | (Account not found) |

---

## Why This Approach?

### Multi-Account Requirements:
1. **Reactive Branding**: Logo/title must change when URL changes (`/foo` → `/bar`)
2. **No Hardcoding**: Can't use static constants (different per account)
3. **Single Source**: Account config files are source of truth
4. **Type Safety**: AccountService provides typed observables

### Token Approach Failed Because:
- ❌ `DEPLOYED_RESOURCES` was static (hardcoded at module init)
- ❌ Couldn't react to URL changes
- ❌ Required provider setup in every module
- ❌ Not designed for dynamic account switching

### AccountService Succeeds Because:
- ✅ Reactive observables that emit new values on account change
- ✅ Reads from account config files (dynamic)
- ✅ Singleton service (available everywhere)
- ✅ Built for multi-account architecture

---

## Related Documentation

- `multi-account-i18n-support.md` - How text values can be i18n keys or plain text
- `DEPLOYED_RESOURCES token` - Legacy pattern (deprecated for branding)
- `AccountService` - Core service for account-aware components

---

## Cleanup Completed

✅ **Removed:**
- `branding` property from `tierConfiguration` type
- `branding` implementation from `themesT1Configuration`
- All `@Inject(DEPLOYED_RESOURCES)` for branding purposes

✅ **Kept:**
- `DEPLOYED_RESOURCES` token (still useful for non-account-specific static assets like flags, backgrounds)
- `UPLOADED_RESOURCES` token (for user-generated content)

---

## Future: When to Use What?

| Use Case | Service/Token | Reactive? | Multi-Account? |
|----------|--------------|-----------|----------------|
| **Account logo/title** | `AccountService` | ✅ Yes | ✅ Yes |
| **Static flags/icons** | `DEPLOYED_RESOURCES` | ❌ No | ❌ No |
| **User avatars** | `UPLOADED_RESOURCES` | ❌ No | ❌ No |
| **App settings** | `AccountService` | ✅ Yes | ✅ Yes |

**Rule of thumb:** If it changes per account → use `AccountService`. If it's static for all accounts → use tokens.

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-27  
**Status**: ✅ Migration Complete
