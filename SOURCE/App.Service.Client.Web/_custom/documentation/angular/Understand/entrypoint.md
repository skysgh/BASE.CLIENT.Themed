Angular is still about HTML. 

So there is an entry page: `src/index.html`

The code of the page is 

```xml
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Velzon - Angular 17 Responsive Admin Dashboard Template</title>
  <!-- <base href="/velzon/angular/minimal/"> -->
  <!-- <base href="/velzon/angular/minimal-rtl/"> -->
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="{{system.sources.assets.public.static.services.images}}favicon.ico">
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE"></script>
</head>
```

The bootstrapping code starts src/app.module.ts which defines `AppModule`.

`AppModule` defines that it is responsible for a child component called app-component, 
with a tag of `app-root`.

THe `AppModule` defines this `AppComponent`(in `app.component.ts`) as the bootstrapping component.

So it gets injected into index where it finds the same tag (`<app-root>`).

This `app-root` component's html contains a `<router-outlet>` which is where views will be routed to.

THe routes are defined in this modules routeing file. 

In this case, it's `app-routing.module.ts`

In there you see 

```ts
const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
  { path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
  { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)},
];
```

Where the first empty path is pointing to 
`LayoutComponent` (`src/layouts/layoutcomponent.ts`), 
which was already imported into `AppModule` (`src/app.module.ts`) earlier.
To do that, it had to import its owning module as well, so notice the earlier
```ts
import { BaseCoreLayoutsModule } from "./layouts/layouts.module";
```
because it explains somethign that shows up next.



That file is relativey interesting in that with Ag conditions
it chooses only one child layout to use.

```ts
@if(isVerticalLayoutRequested()){
<app-vertical></app-vertical>
}
```
The tag is associated to a component. 
The reason this component is known to be associated with `<app-vertical>`

is that it's component was already imported when it's parent module (layoutModule)
was imported, and in doing so it registed the 4 or so different layout controls...See?

Anyway, we're only using one layout.

So if we go there (eg: `vertical-component`(`src/vertical/vertical-component.ts`))
we can see it importing a whole bunch of related controls (header, footer, etc.)

But more interestingly, in the middle of it, is another `<router-outlet>`, which 
is associated to this module's route...hold on...it's missing.

Q: does one have to make a route file here?
No. Going back to the routes file we notice that it went to layouts. 
But specified a different module to load into it.

```ts
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
```










<body>
  <app-root></app-root>
</body>

</html>
```
