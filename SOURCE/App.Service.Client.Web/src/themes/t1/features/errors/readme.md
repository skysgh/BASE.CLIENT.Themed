# Development Directives #

The folder/module is for handling Views (ie `components`) for rendering to the end user 
navigation `Errors`.

This module is a `feature module` and is lazy-loaded
as needed (ie, it is not loaded at startup as it's not always needed).

Keep an eye on `AppRoutingModule`, where it is pathed to lazy load this module:

```ts
  { path: 'errors', loadChildren: () => import('../errors/module').then(m => m.AppBaseCoreErrorsModule) },
```
