/**
 * Notification Center Component
 * 
 * Full page view of all notifications with management options.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 900px; padding: 1.5rem;">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-sm">
            <div class="avatar-title bg-primary-subtle text-primary rounded">
              <i class="ri-notification-3-line fs-20"></i>
            </div>
          </div>
          <div>
            <h4 class="mb-0">Notifications</h4>
            <p class="text-muted mb-0">
              {{ notificationService.unreadCount() }} unread
            </p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button 
            class="btn btn-soft-secondary"
            (click)="notificationService.refresh()">
            <i class="ri-refresh-line"></i>
          </button>
          @if (notificationService.hasUnread()) {
            <button 
              class="btn btn-soft-primary"
              (click)="notificationService.markAllAsRead()">
              <i class="ri-check-double-line me-1"></i>
              Mark All Read
            </button>
          }
        </div>
      </div>

      <!-- Loading -->
      @if (notificationService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Empty -->
      @if (!notificationService.loading() && notificationService.notifications().length === 0) {
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="ri-notification-off-line fs-48 text-muted"></i>
            <h5 class="mt-3 text-muted">No Notifications</h5>
            <p class="text-muted">You're all caught up!</p>
          </div>
        </div>
      }

      <!-- Notification List -->
      @if (!notificationService.loading() && notificationService.notifications().length > 0) {
        <div class="card">
          <div class="list-group list-group-flush">
            @for (notification of notificationService.notifications(); track notification.id) {
              <div 
                class="list-group-item list-group-item-action"
                [class.bg-light]="!notification.isRead">
                <div class="d-flex align-items-start gap-3">
                  <div class="avatar-sm flex-shrink-0">
                    <div 
                      class="avatar-title rounded-circle"
                      [class]="'bg-' + notification.typeColor + '-subtle text-' + notification.typeColor">
                      <i [class]="notification.typeIcon"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                      <h6 class="mb-1" [class.fw-semibold]="!notification.isRead">
                        {{ notification.title }}
                      </h6>
                      <small class="text-muted">{{ notification.timeAgo }}</small>
                    </div>
                    <p class="text-muted mb-0 small">{{ notification.message }}</p>
                  </div>
                  @if (!notification.isRead) {
                    <button 
                      class="btn btn-sm btn-ghost-primary"
                      (click)="notificationService.markAsRead(notification.id)"
                      title="Mark as read">
                      <i class="ri-check-line"></i>
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class NotificationCenterComponent {
  notificationService = inject(NotificationService);
}
