# Errors App.Part

Platform applet for **error page presentation**.

## Scope

This app.part handles all HTTP error pages using a single parameterized component:
- **000** - Unknown/fallback error
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **404-A** - Account Not Found
- **500** - Internal Server Error
- **502** - Bad Gateway
- **503** - Service Unavailable
- **offline** - Network offline

## Architecture

Single parameterized component pattern:
- Route: `/errors/:code` (e.g., `/errors/404`, `/errors/500`)
- Component reads code from route params
- Looks up configuration in `error-data.ts`
- Falls back to `000` if code not found
- All text uses i18n translation keys

## Routes

```
/errors/
├── (default)        → 000 (unknown error)
├── 401              → Unauthorized
├── 403              → Forbidden
├── 404              → Not Found
├── 500              → Server Error
└── :code            → Any error code
```

## Benefits

- **DRY**: Single component for all error pages
- **Maintainable**: Add new codes by updating `error-data.ts` only
- **Consistent**: Same layout, different content
- **i18n**: All text is translatable

## Adding New Error Codes

1. Add configuration to `models/error-data.ts`
2. Add translation keys to i18n files
3. Done - no new component needed

## Files

```
errors/
├── README.md
├── module.ts
├── routing.ts
├── index.ts
├── models/
│   └── error-data.ts        # Error configurations
└── views/
    └── error/
        └── component.ts      # Parameterized error view
```

## Related

- **Maintenance** (`/system/maintenance`) - Downtime pages
- **Themes** (`themes/t1/features/errors`) - Legacy theme-specific error pages (deprecated)
