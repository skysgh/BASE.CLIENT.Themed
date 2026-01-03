# Auth-Landing Feature

## Purpose

Contains landing pages related to authentication state changes:
- **signed-out**: Shown after user logs out
- **session-expired**: (Future) Shown when session times out
- **account-locked**: (Future) Shown when account is locked

## Structure

```
auth-landing/
├── ui/
│   └── pages/
│       ├── signed-out/         # Post-logout landing page
│       │   ├── component.ts
│       │   ├── component.html
│       │   └── component.scss
│       └── session-expired/    # (Future)
├── services/
│   ├── app-stats.service.ts    # App statistics for display
│   └── index.ts
├── models/                     # (Future)
├── index.ts
└── README.md
```

## Routes

These pages are loaded as standalone components:

```typescript
{ 
  path: 'signed-out', 
  loadComponent: () => import('./ui/pages/signed-out/component')
    .then(m => m.SignedOutLandingComponent) 
}
```

## Design Principles

1. **Value Showcase**: Use auth transition pages to remind users of app value
2. **Clear CTAs**: Provide obvious next actions (sign in, go home)
3. **Statistics**: Show app stats to reinforce trust and value
4. **Standalone**: These are full-page standalone components (not within app layout)
