//// Import Ag:
//import { NgModule } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';

//// Import Template:
//import { LayoutComponent } from '../../../app/layouts/layout.component';

//// Auth
//import { AuthGuard } from '../../../app/core/guards/auth.guard';


//// Will be displayed within app.component's route-outlet:
//const routes: Routes = [
//  /* TODO: REPLACED: { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] }, */
//  { path: '', component: LayoutComponent, loadChildren: () => import('../../apps/module').then(m => m.CustomAppsModule), canActivate: [AuthGuard] },
//  // while above is displayed within the layout,
//  // the following are displayed directly without a frame:
//  { path: 'auth', loadChildren: () => import('../../core/modules/account/account.module').then(m => m.AccountModule)  },
//  { path: 'pages', loadChildren: () => import('../../../app/extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
//  // only pages that are open
//  { path: 'landing', loadChildren: () => import('../../../_BASE/core/modules/landing/module').then(m => m.LandingModule) }
//];

//@NgModule({
//  imports: [RouterModule.forRoot(routes)],
//  exports: [RouterModule]
//})
//export class AppRoutingModule { }
