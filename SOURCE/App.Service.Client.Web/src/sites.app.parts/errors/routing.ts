/**
 * Errors App.Part Routing
 * 
 * Routes for error pages.
 * Delegates to theme error components for presentation.
 * 
 * Note: These routes should work with or without account prefix
 * e.g., /errors/404 or /bar/errors/404
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // Lazy load the theme's error module
  // This keeps the presentation in themes/ but routing in app.parts/
  {
    path: '',
    loadChildren: () => import('../../themes/t1/features/errors/module').then(m => m.BaseThemesV1FeaturesErrorsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
