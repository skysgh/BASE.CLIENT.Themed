// Import Ag:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




import { AppROComponent } from './ui/component';
import { AppLayoutComponent} from '../../../../app/layouts/layout.component';

// Auth
import { AuthGuard } from '../../../../app/core/guards/auth.guard';


const routes: Routes = [
  // app.module states bootstrap: [AppROComponent]
  // so it already knows what control to load, and it happens to be a
  // route controller.
  // So no need to define again below

  // so pages and landing (and auth, etc.) will be loaded directly within
  // the AppROComponent. They also don't need to be gaurded - they're public access.
  { path: '', loadChildren: () => import('../landing/module').then(m => m.BaseCoreLandingModule)},
  { path: 'pages', loadChildren: () => import('../pages/module').then(m => m.BaseCorePagesModule) },
  // But apps, is more complex and is wrapped in the AppLayout frame first
  // and it is guarded.
  { path: 'apps', component: AppLayoutComponent, loadChildren: () => import('../../../apps/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
//  { path: 'settings', component: AppLayoutComponent, loadChildren: () => import('../../../apps/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
  // This again goes in the main AppROContainer with no prior framing:
  { path: 'auth', loadChildren: () => import('../account/account.module').then(m => m.BaseAccountModule) },
  // specifies what is default:
  { path: 'landing', redirectTo: '', pathMatch: 'prefix' }   
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
