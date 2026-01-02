# i18n (Internationalization) App.Part

Language and localization management.

## Purpose

Manages available languages for the application:
- Enable/disable languages
- Configure language display order
- Future: Dynamic translation management

## Structure

```
i18n/
├── models/           # DTOs and ViewModels
├── mappers/          # DTO ↔ ViewModel mapping
├── repositories/     # API communication
├── services/         # Business logic
├── ui/
│   └── views/        # Admin views
├── module.ts         # NgModule
└── index.ts          # Public exports
```

## Routes

- `/system/i18n` - Language management hub
- `/system/i18n/languages` - Enable/disable languages

## Future Plans

- Dynamic translation key management
- Community translation contributions
- Translation file upload/download
