// Import Ag:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { BaseRouterOutletComponent } from './ui/_routerOutlet/component';
import { AppLayoutComponent} from '../layouts/layout.component';

// Auth
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Constants:
import { system } from '../../../../core/constants/system';


const routes: Routes = [
  //// app.module states bootstrap: [AppROComponent]
  //// so it already knows what control to load, and it happens to be a
  //// route controller.
  //// So no need to define again below

  //// so pages and landing (and auth, etc.) will be loaded directly within
  //// the AppROComponent. They also don't need to be gaurded - they're public access.

  { path: 'dashboards', component: AppLayoutComponent, loadChildren: () => import('../dashboard/module').then(m => m.BaseCoreDashboardsModule), canActivate: [AuthGuard] },

  //// But apps, is more complex:
  //// Is is wrapped in the AppLayout frame first.
  //// And it is Guarded.
  { path: 'pages', loadChildren: () => import('../pages/module').then(m => m.BaseCorePagesModule) },
  { path: 'apps', component: AppLayoutComponent, loadChildren: () => import('../../../../app.lets/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
  ////  { path: 'settings', component: AppLayoutComponent, loadChildren: () => import('../../../apps/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
  //// This again goes in the main AppROContainer with no prior framing:
  //// specifies what is default:
  { path: 'landing', redirectTo: 'pages/landing', pathMatch: 'prefix' },
  { path: 'information', redirectTo: 'pages/information', pathMatch: 'prefix' },
  { path: 'auth', loadChildren: () => import('../user/account/module').then(m => m.BaseCoreAccountModule) },
  { path: 'errors', loadChildren: () => import('../errors/module').then(m => m.AppBaseCoreErrorsModule) },

  { path: '', redirectTo: 'pages', pathMatch: 'full' },

  { path: '**', redirectTo: 'errors' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
/**
 * Routing Module invoked from root AppModule.
 */
export class AppRoutingModule {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("AppRoutingModule.constructor()");
  }
}
