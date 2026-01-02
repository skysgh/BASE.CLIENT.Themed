# Notifications App.Part

In-app notifications and alerts system.

## Purpose

Manages user notifications including:
- System alerts
- Activity notifications
- Real-time updates
- Notification preferences

## Structure

```
notifications/
├── models/           # DTOs and ViewModels
├── mappers/          # DTO ↔ ViewModel mapping
├── repositories/     # API communication
├── services/         # Business logic
├── ui/
│   ├── views/        # Full page views
│   └── widgets/      # Embeddable components (topbar dropdown)
├── constants/        # Notification types, etc.
├── module.ts         # NgModule
├── routing.ts        # Routes
└── index.ts          # Public exports
```

## Routes

- `/system/notifications` - Notification center
- `/system/notifications/settings` - Notification preferences

## Integration

The topbar notification dropdown uses the widget from this module.
