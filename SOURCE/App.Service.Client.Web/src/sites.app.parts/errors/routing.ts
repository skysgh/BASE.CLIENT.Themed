/**
 * Errors App.Part Routing
 * 
 * Routes for error pages using parameterized error component.
 * Single component handles all error codes via route parameter.
 * 
 * Note: These routes should work with or without account prefix
 * e.g., /errors/404 or /bar/errors/404
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './ui/views/error/component';

const routes: Routes = [
  // Default - show 000 (unknown error)
  {
    path: '',
    component: ErrorComponent
  },
  // Parameterized error by code
  {
    path: ':code',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
