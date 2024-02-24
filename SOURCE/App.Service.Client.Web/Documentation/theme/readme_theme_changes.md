## Developer Directions ##

As discussed [previously](./), try to keep all customisation changes to within:
* `src/app/custom`.
* `src/assets/custom`

That said, the following artefacts outside the above folders required changes too:

* `/`:
  * `index.html`:
    * Header Text
      * TODO: This might be addressable later using a script to make it dynamic.
  * `favicon.ico`
  * `src/`:
    * `app/`:
      * `app-routing.module.ts`:
        * change path 
        * from: `{ path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },`
        * to:   `{ path: '', component: LayoutComponent, loadChildren: () => import('./custom/apps/apps.module').then(m => m.AppsModule), canActivate: [AuthGuard] },`
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


