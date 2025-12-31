import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Users Sub-Module
 * 
 * User identity management (admin functionality).
 * For now, placeholder routes - views to be added as needed.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        // Placeholder - will load a users list component when created
        loadComponent: () => import('./views/users-list/component').then(m => m.UsersListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./views/user-detail/component').then(m => m.UserDetailComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class UsersModule { }
