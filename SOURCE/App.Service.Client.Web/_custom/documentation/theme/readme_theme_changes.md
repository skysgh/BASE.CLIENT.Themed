## Developer Directions ##

As discussed [previously](./), try to keep all customisation changes to within:
* `src/app/_custom`.
* `src/assets/_custom`

That said, the following artefacts outside the above folders required changes too:

* `/`:
  * `package.json`:
    * Add the following to script section to launch simple json-server:
    * `"json-server": "json-server api/db.json --routes api/routes.json --no-cors=true"`  
  * `src/`:
    * `index.html`:
      * Header Text
        * TODO: This might be addressable later using a script to make it dynamic.
    * `favicon.ico`
    * `environments/`:
      * `environments.ts`
      * `environments.prod.ts`
    * `app/`:
      * `app-routing.module.ts`:
        * change path 
        * from: `{ path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },`
        * to:   `{ path: '', component: LayoutComponent, loadChildren: () => import('./_custom/apps/apps.module').then(m => m.CustomAppsModule), canActivate: [AuthGuard] },`
    * `assets/`:
      * `images/`:
        * `favicon.ico`
        * `logo-dark.png`
        * `logo-light.png`
        * `logo-sm.png`
        * `logo-sm-1.png`
      * `i18n/`:
        * `en.json`
        * ...& others...


Other considerations:
* multiple menus exist under `/layouts/` and they each have to be updated.


