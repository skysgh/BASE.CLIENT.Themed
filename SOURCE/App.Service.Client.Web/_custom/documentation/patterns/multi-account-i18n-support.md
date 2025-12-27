# Multi-Account i18n Support

**Created**: 2025-12-27  
**Pattern**: Account Config + i18n Integration

---

## Overview

Account configuration values can be **either i18n keys OR plain text**. The `baseTranslate` pipe automatically:
1. ✅ Resolves i18n keys to translated text
2. ✅ Leaves plain text as-is (fallback)

This allows flexible branding: some accounts use i18n keys for multi-language support, others use direct text strings.

---

## Example Account Config

```json
{
  "accountId": "default",
  "name": "Default Account",
  "title": "BASE.ACCOUNTS.DEFAULT.TITLE",
  "subtitle": "BASE.ACCOUNTS.DEFAULT.SUBTITLE",
  "description": "BASE.ACCOUNTS.DEFAULT.DESCRIPTION",
  "branding": {
    "logo": "/assets/core/media/open/accounts/default/logo-dark.svg"
  }
}
```

### How It Works:

| Field | Value Type | Result |
|-------|-----------|--------|
| `name` | Plain text | Shows: "Default Account" |
| `title` | i18n key | Shows translated: "BASE Application" (if key exists in en.json) |
| `subtitle` | i18n key | Shows translated: "Multi-Account Platform" (if key exists) |
| `description` | i18n key | Shows translated text or falls back to key itself if not found |

---

## Usage in Components

### TypeScript:
```typescript
export class MyComponent {
  // ✅ Get value from account config (reactive)
  public title$ = this.accountService.getConfigValue('title');
  public subtitle$ = this.accountService.getConfigValue('subtitle');
}
```

### Template:
```html
<!-- ✅ baseTranslate pipe handles both i18n keys and plain text -->
<h1>{{title$ | async | baseTranslate}}</h1>
<h2>{{subtitle$ | async | baseTranslate}}</h2>
```

---

## Adding i18n Keys

### 1. Add keys to en.json:
```json
{
  "BASE": {
    "ACCOUNTS": {
      "DEFAULT": {
        "TITLE": "BASE Application",
        "SUBTITLE": "Multi-Account Platform",
        "DESCRIPTION": "The better way to build value."
      },
      "FOO": {
        "TITLE": "FOO Corporation",
        "SUBTITLE": "Innovation at Scale",
        "DESCRIPTION": "Leading the future of technology."
      }
    }
  }
}
```

### 2. Reference in account config:
```json
{
  "accountId": "foo",
  "title": "BASE.ACCOUNTS.FOO.TITLE",
  "subtitle": "BASE.ACCOUNTS.FOO.SUBTITLE"
}
```

---

## Benefits

✅ **Flexibility**: Mix i18n keys and plain text as needed  
✅ **Multi-Language**: Accounts with i18n keys support multiple languages  
✅ **Fallback**: Plain text works immediately without translation files  
✅ **No Code Changes**: baseTranslate pipe handles both automatically  
✅ **SEO**: Search engines see final translated text  

---

## Pattern for All Text Fields

**Any text field in account config can be:**
- ✅ Plain text: `"My Company Name"`
- ✅ i18n key: `"BASE.ACCOUNTS.MYCOMPANY.NAME"`
- ✅ Mix: Some fields plain, others i18n

The baseTranslate pipe resolves keys OR leaves plain text unchanged.

---

## Example: Multi-Language Account

```json
{
  "accountId": "global",
  "name": "BASE.ACCOUNTS.GLOBAL.NAME",
  "title": "BASE.ACCOUNTS.GLOBAL.TITLE",
  "subtitle": "BASE.ACCOUNTS.GLOBAL.SUBTITLE"
}
```

**English (en.json):**
```json
{
  "BASE": {
    "ACCOUNTS": {
      "GLOBAL": {
        "NAME": "Global Corporation",
        "TITLE": "Welcome",
        "SUBTITLE": "Serving the world"
      }
    }
  }
}
```

**Spanish (es.json):**
```json
{
  "BASE": {
    "ACCOUNTS": {
      "GLOBAL": {
        "NAME": "Corporación Global",
        "TITLE": "Bienvenido",
        "SUBTITLE": "Sirviendo al mundo"
      }
    }
  }
}
```

Result: Same account config, different languages! 🌍

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-27  
**Status**: ✅ Active Pattern
