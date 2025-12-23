## Development Directives ##

The folder/module is for handling Views (ie `components`) 
and backing services specific to 
`System User` authentication, inclusive of 
`signup`, `signin`, `lock`, `signout`, vpassword-reset`, etc.

This module is a `feature module` and is lazy-loaded
as needed (ie, it is not loaded at startup as it's not always needed).

Keep an eye on `AppRoutingModule`, where it is pathed to 
lazy load this module:

```ts
 { path: 'auth', loadChildren: () => import('../user/account/module').then(m => m.BaseThemesV1UserAccountModule) },
 ```
