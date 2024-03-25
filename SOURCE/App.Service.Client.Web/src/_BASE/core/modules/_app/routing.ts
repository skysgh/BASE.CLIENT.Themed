// Import Ag:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




//import { BaseRouterOutletComponent } from './ui/_routerOutlet/component';
import { AppLayoutComponent} from '../layouts/layout.component';

// Auth
import { AuthGuard } from '../../guards/auth.guard';
import { DiagnosticsTraceService } from '../../services/diagnostics.service';
// Constants:
import { system } from '../../constants/system';


const routes: Routes = [
  //// app.module states bootstrap: [AppROComponent]
  //// so it already knows what control to load, and it happens to be a
  //// route controller.
  //// So no need to define again below

  //// so pages and landing (and auth, etc.) will be loaded directly within
  //// the AppROComponent. They also don't need to be gaurded - they're public access.
  { path: '', loadChildren: () => import('../pages/home/module').then(m => m.BaseCoreHomeModule) },

  { path: 'pages', loadChildren: () => import('../pages/module').then(m => m.BaseCorePagesModule) },
  //// But apps, is more complex:
  //// Is is wrapped in the AppLayout frame first.
  //// And it is Guarded.
  { path: 'apps', component: AppLayoutComponent, loadChildren: () => import('../../../apps/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
  ////  { path: 'settings', component: AppLayoutComponent, loadChildren: () => import('../../../apps/module').then(m => m.BaseAppsModule), canActivate: [AuthGuard] },
  //// This again goes in the main AppROContainer with no prior framing:
  { path: 'auth', loadChildren: () => import('../account/module').then(m => m.BaseCoreAccountModule) },
  //// specifies what is default:
  { path: 'landing', redirectTo: 'pages/landing', pathMatch: 'prefix' },
  { path: 'information', redirectTo: 'pages/information', pathMatch: 'prefix' },
  { path: 'errors', loadChildren: () => import('../errors/module').then(m => m.AppBaseCoreErrorsModule) },

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
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("AppRoutingModule.constructor()");
  }
}
