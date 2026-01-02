# Navigation App.Part

Dynamic navigation and menu management.

## Purpose

Provides:
- **Menu management**: Configure sidebar/topbar menu items
- **Dynamic navigation**: Runtime menu customization
- **Role-based visibility**: Show/hide items based on permissions
- **Navigation analytics**: Track navigation patterns

## Relationship to Core

`core/navigation/` contains:
- Navigation models and interfaces
- Navigation tree service (builds menu from config)
- Static menu configuration

This `navigation/` app.part contains:
- Admin UI for managing menus
- API integration for dynamic menus
- Navigation preferences per user/account

## Structure

```
navigation/
├── models/
│   ├── menu-item.dto.ts       # API model
│   └── menu-item.view-model.ts
├── services/
│   └── menu-admin.service.ts  # CRUD for menu items
├── ui/
│   └── views/
│       └── menu-editor/       # Visual menu editor
├── module.ts
└── index.ts
```

## Future Features

- Drag-and-drop menu editor
- Custom menu icons
- Deep link support
- Menu item analytics
