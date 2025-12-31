# Maintenance App.Part

Platform applet for **service status** notifications - "we're down" pages.

## Scope

This app.part handles service interruption states:
- **Scheduled Maintenance** - Planned downtime
- **Unscheduled Outage** - Something went wrong
- **Coming Soon** - Feature not yet available
- **Status Updates** - Real-time status information

## Views

### `/system/maintenance`
Main maintenance page - shows current status and ETA.

### `/system/maintenance/status`
Detailed status page with timeline of updates.

### `/system/coming-soon`
Coming soon page with countdown (for future features).

## Design Decisions

1. **Lazy Loaded** - Maintenance is rare, don't preload
2. **API Integration** - Can fetch live status from status API
3. **ETA Display** - Shows estimated time to resolution
4. **Updates Timeline** - "We're investigating", "Fix deployed", etc.

## Status States

```typescript
type MaintenanceStatus = 
  | 'scheduled'    // Planned maintenance window
  | 'investigating' // Something's wrong, looking into it
  | 'identified'   // Root cause found
  | 'monitoring'   // Fix deployed, watching
  | 'resolved';    // All clear
```

## Related

- **Errors** (`/errors/*`) - Application/HTTP errors
- **Notifications** - User-level alerts (different concern)

## API Integration (Future)

```
GET /api/status
{
  status: 'maintenance' | 'operational' | 'degraded',
  message: 'Scheduled maintenance until 6:00 AM UTC',
  eta: '2024-01-01T06:00:00Z',
  updates: [
    { time: '...', message: 'Maintenance started' },
    { time: '...', message: 'Database upgrade in progress' }
  ]
}
```
