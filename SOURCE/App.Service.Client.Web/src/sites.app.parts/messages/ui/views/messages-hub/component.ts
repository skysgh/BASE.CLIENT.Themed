/**
 * Messages Hub Component
 * 
 * Landing page for the Messages module.
 * Shows quick stats and navigation to different views.
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MessageService } from '../../../services/message.service';
import { FolderStats } from '../../../models/message.model';
import { PageHeaderComponent } from '../../../../../../sites/ui/widgets/page-header/component';

@Component({
  selector: 'app-messages-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  template: `
    <div class="container-fluid">
      <!-- Page Header -->
      <app-page-header
        title="Messages"
        subtitle="Manage your messages and communications"
        icon="bx-envelope"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        backFallback="/system/hub">
        <ng-container actions>
          <a [routerLink]="['classic', 'compose']" class="btn btn-primary">
            <i class="bx bx-plus me-1"></i> Compose
          </a>
          <a [routerLink]="['classic']" class="btn btn-soft-secondary">
            <i class="bx bx-envelope me-1"></i> Open Mailbox
          </a>
        </ng-container>
      </app-page-header>

      <!-- Stats Cards -->
      <div class="row">
        <!-- Inbox -->
        <div class="col-xl-3 col-md-6">
          <div class="card card-animate">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-uppercase fw-medium text-muted mb-0">Inbox</p>
                </div>
              </div>
              <div class="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 class="fs-22 fw-semibold mb-4">
                    {{ stats.inbox.total }}
                    @if (stats.inbox.unread > 0) {
                      <span class="badge bg-danger ms-2">{{ stats.inbox.unread }} new</span>
                    }
                  </h4>
                  <a [routerLink]="['classic', 'inbox']" class="text-decoration-underline">
                    View Inbox
                  </a>
                </div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-primary-subtle rounded fs-3">
                    <i class="bx bx-envelope text-primary"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sent -->
        <div class="col-xl-3 col-md-6">
          <div class="card card-animate">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-uppercase fw-medium text-muted mb-0">Sent</p>
                </div>
              </div>
              <div class="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 class="fs-22 fw-semibold mb-4">{{ stats.sent.total }}</h4>
                  <a [routerLink]="['classic', 'sent']" class="text-decoration-underline">
                    View Sent
                  </a>
                </div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-success-subtle rounded fs-3">
                    <i class="bx bx-send text-success"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Drafts -->
        <div class="col-xl-3 col-md-6">
          <div class="card card-animate">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-uppercase fw-medium text-muted mb-0">Drafts</p>
                </div>
              </div>
              <div class="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 class="fs-22 fw-semibold mb-4">{{ stats.drafts.total }}</h4>
                  <a [routerLink]="['classic', 'drafts']" class="text-decoration-underline">
                    View Drafts
                  </a>
                </div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-warning-subtle rounded fs-3">
                    <i class="bx bx-file text-warning"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Starred -->
        <div class="col-xl-3 col-md-6">
          <div class="card card-animate">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-uppercase fw-medium text-muted mb-0">Starred</p>
                </div>
              </div>
              <div class="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 class="fs-22 fw-semibold mb-4">{{ stats.starred.total }}</h4>
                  <a [routerLink]="['classic', 'starred']" class="text-decoration-underline">
                    View Starred
                  </a>
                </div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-info-subtle rounded fs-3">
                    <i class="bx bx-star text-info"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View Options -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">View Options</h5>
            </div>
            <div class="card-body">
              <div class="row g-4">
                <!-- Classic View -->
                <div class="col-lg-6">
                  <div class="card border card-border-primary h-100">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-3">
                        <div class="avatar-sm me-3">
                          <span class="avatar-title bg-primary-subtle rounded">
                            <i class="bx bx-envelope-open text-primary fs-4"></i>
                          </span>
                        </div>
                        <div>
                          <h5 class="card-title mb-1">Classic Mailbox</h5>
                          <p class="text-muted mb-0">Traditional email client layout</p>
                        </div>
                      </div>
                      <p class="text-muted">
                        Email-like interface with folder navigation, message list, 
                        and reading pane. Familiar layout for users accustomed to 
                        traditional email clients.
                      </p>
                      <a [routerLink]="['classic']" class="btn btn-primary">
                        Open Classic View
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Standard View (Future) -->
                <div class="col-lg-6">
                  <div class="card border h-100 opacity-50">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-3">
                        <div class="avatar-sm me-3">
                          <span class="avatar-title bg-secondary-subtle rounded">
                            <i class="bx bx-grid-alt text-secondary fs-4"></i>
                          </span>
                        </div>
                        <div>
                          <h5 class="card-title mb-1">Standard View</h5>
                          <span class="badge bg-secondary">Coming Soon</span>
                        </div>
                      </div>
                      <p class="text-muted">
                        Schema-driven BREAD pattern views using the standard entity 
                        layout. Consistent with other system modules. 
                        <em>To be implemented after schema patterns are finalized.</em>
                      </p>
                      <button class="btn btn-soft-secondary" disabled>
                        Not Yet Available
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Messages Preview -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">Recent Messages</h5>
              <a [routerLink]="['classic', 'inbox']" class="btn btn-sm btn-soft-primary">
                View All
              </a>
            </div>
            <div class="card-body">
              @if (recentMessages.length === 0) {
                <div class="text-center py-4 text-muted">
                  <i class="bx bx-envelope display-4"></i>
                  <p class="mt-2">No messages yet</p>
                </div>
              } @else {
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <tbody>
                      @for (msg of recentMessages; track msg.id) {
                        <tr [class.fw-semibold]="!msg.isRead" style="cursor: pointer;">
                          <td style="width: 40px;">
                            <div class="avatar-xs">
                              @if (msg.senderAvatar) {
                                <img [src]="msg.senderAvatar" class="rounded-circle" alt="">
                              } @else {
                                <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                                  {{ msg.senderName.charAt(0) }}
                                </span>
                              }
                            </div>
                          </td>
                          <td>
                            <span class="text-body">{{ msg.senderName }}</span>
                          </td>
                          <td>
                            <span>{{ msg.subject }}</span>
                            <span class="text-muted ms-2">- {{ msg.preview }}</span>
                          </td>
                          <td class="text-end" style="width: 100px;">
                            <span class="text-muted fs-12">{{ formatDate(msg.createdAt) }}</span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-animate {
      transition: all 0.3s ease;
    }
    .card-animate:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
  `]
})
export class MessagesHubComponent implements OnInit {
  private messageService = inject(MessageService);

  stats: FolderStats = {
    inbox: { total: 0, unread: 0 },
    sent: { total: 0 },
    drafts: { total: 0 },
    starred: { total: 0 },
    trash: { total: 0 },
    spam: { total: 0 },
  };

  recentMessages: any[] = [];

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentMessages();
  }

  private loadStats(): void {
    this.stats = this.messageService.folderStats();
  }

  private loadRecentMessages(): void {
    this.messageService.getMessages({ folder: 'inbox' }, 1, 5).subscribe(result => {
      this.recentMessages = result.messages;
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
}
