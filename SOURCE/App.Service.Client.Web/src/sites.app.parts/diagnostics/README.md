# Diagnostics App.Part

Platform applet for **system diagnostics** - remote log viewing and monitoring.

## Scope

This app.part handles:
- **Log Viewing** - Browse and search diagnostic logs
- **Log Filtering** - Filter by level, source, timestamp
- **System Health** - Health check status (future)

## HARD BREAST Views (Read-Only)

This module follows D-BREAST pattern (read-only - users cannot edit/add/delete logs):
- **H**ub - Central diagnostics dashboard
- **A**nalytics - Log trends and patterns (future)
- **R**eports - Diagnostic reports export (future)
- **D**ashboard - Widgets showing log stats
- **B**rowse - List log entries with filtering
- **R**ead - View log entry details

Note: E (Edit), A (Add), S (State), T (Trash) are NOT applicable - logs are immutable.

## Routes

```
/system/diagnostics/
├── hub              - Diagnostics hub
├── dashboard        - Stats widgets
└── logs/            - Log viewer
    ├── list         - Browse all logs (B)
    └── :id          - View log detail (R)
```

## Models

### LogEntryDto
```typescript
interface LogEntryDto {
  id: string;
  timestamp: string;
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: string;        // Component/service that logged
  message: string;
  details?: any;         // Additional data
  correlationId?: string;
  userId?: string;
  accountId?: string;
}
```

## Dashboard Widgets

1. **Error Count** - Errors in last 24h
2. **Log Volume** - Total logs / rate
3. **Health Status** - Green/Yellow/Red
4. **Top Sources** - Most active loggers

## Security Considerations

- Logs may contain sensitive information
- Access should be restricted to admins
- Consider redacting PII in display
- Audit log viewing itself

## Related

- **Operations** (`/system/operate`) - Admin operations
- **About** (`/system/about`) - System info
