/**
 * Activity Widget Component
 * 
 * Displays recent activity feed on the Hub page.
 * Shows timeline of recent actions across all applets.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-card card h-100" (click)="onClick()">
      <div class="card-body">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <div class="widget-icon bg-secondary-subtle text-secondary">
              <i class="bx bx-time-five"></i>
            </div>
            <div class="ms-3">
              <h6 class="mb-0">Recent Activity</h6>
              <p class="text-muted small mb-0">Your activity log</p>
            </div>
          </div>
          <span class="badge bg-primary-subtle text-primary">
            {{ activityCount }} items
          </span>
        </div>

        <!-- Loading -->
        @if (loading) {
          <div class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary"></div>
          </div>
        }

        <!-- Activity Items -->
        @if (!loading) {
          <div class="activity-list">
            @for (item of recentItems; track item.id) {
              <div class="activity-item d-flex align-items-start py-2 border-bottom">
                <div class="activity-icon me-2">
                  <i class="bx {{ item.icon }} text-{{ item.iconColor }}"></i>
                </div>
                <div class="flex-grow-1">
                  <p class="mb-0 small">{{ item.description }}</p>
                  <small class="text-muted">{{ item.timeAgo }}</small>
                </div>
              </div>
            } @empty {
              <div class="text-center text-muted py-3">
                <i class="bx bx-history fs-32 d-block mb-2"></i>
                <p class="mb-0 small">No recent activity</p>
              </div>
            }
          </div>
        }

        <!-- Footer -->
        <div class="widget-footer mt-3 pt-2 border-top text-end">
          <span class="text-primary small">
            View all <i class="bx bx-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
    }
    
    .widget-card:hover {
      border-color: var(--vz-primary);
      box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
      transform: translateY(-2px);
    }
    
    .widget-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .activity-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .activity-list {
      max-height: 200px;
      overflow-y: auto;
    }
  `]
})
export class ActivityWidgetComponent implements OnInit {
  private router = inject(Router);

  loading = false;
  activityCount = 0;
  
  // Placeholder activity items
  recentItems: ActivityItem[] = [];

  ngOnInit(): void {
    // Placeholder - would load from activity service
    this.recentItems = [
      {
        id: '1',
        description: 'Created new spike "Search Sync"',
        timeAgo: '2 hours ago',
        icon: 'bx-plus-circle',
        iconColor: 'success'
      },
      {
        id: '2',
        description: 'Updated spike status to In Progress',
        timeAgo: '5 hours ago',
        icon: 'bx-edit',
        iconColor: 'primary'
      },
      {
        id: '3',
        description: 'Submitted feedback request',
        timeAgo: 'Yesterday',
        icon: 'bx-message-dots',
        iconColor: 'info'
      }
    ];
    this.activityCount = this.recentItems.length;
  }

  onClick(): void {
    // Navigate to activity log / search with activity filter
    this.router.navigate(['/apps/system/search'], { 
      queryParams: { type: 'activity' } 
    });
  }
}

interface ActivityItem {
  id: string;
  description: string;
  timeAgo: string;
  icon: string;
  iconColor: string;
}
