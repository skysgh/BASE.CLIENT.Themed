/**
 * Notifications Module
 * 
 * In-app notifications system.
 * 
 * Routes:
 * - /system/notifications - Notification center
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => 
          import('./ui/views/notification-center/component').then(m => m.NotificationCenterComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class NotificationsModule { }
