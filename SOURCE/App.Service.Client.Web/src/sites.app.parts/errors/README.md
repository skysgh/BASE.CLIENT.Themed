# Errors App.Part

Platform applet for **error page** presentation - handling graceful degradation.

## Scope

This app.part handles display of error states:
- **HTTP Errors** - 400, 401, 403, 404, 500, 502, 503, 504
- **Application Errors** - Not found, account issues
- **Offline State** - No network connectivity

## Views

### `/errors/404`
Page not found - most common error page.

### `/errors/500`
Server error - internal error page.

### `/errors/403`
Forbidden - access denied page.

### `/errors/offline`
No network - offline state indicator.

### `/errors/:code`
Parameterized error page - dynamic error display.

## Design Decisions

1. **Lazy Loaded** - Errors are rare, don't preload
2. **Standalone** - Can render without full app bootstrap
3. **Theme-derived** - Uses theme styling but logic is here
4. **Configurable** - Error messages from config/i18n

## Related

- **Maintenance** (`/system/maintenance`) - Scheduled downtime
- **Coming Soon** (`/system/coming-soon`) - Future features

## Routes

```
/errors/
├── 404              - Not found (basic)
├── 404/alt          - Not found (alt style)
├── 404/cover        - Not found (cover style)
├── 500              - Internal server error
├── 403              - Forbidden
├── offline          - Offline/no network
└── :code            - Parameterized by error code
```
