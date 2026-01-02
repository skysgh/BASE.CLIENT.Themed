/**
 * Item Read Component
 * 
 * BREAD: Read view for a single support item.
 * Shows detail, progress visualization, and comments.
 */
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SupportItemService } from '../../services';
import { SupportItemViewModel, SupportCommentViewModel } from '../../models';
import { SUPPORT_STATUSES } from '../../constants';

@Component({
  selector: 'app-item-read',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="item-read">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-3 d-flex justify-content-between align-items-center">
        <a routerLink="../my-items" class="btn btn-primary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to My Items
        </a>
        
        @if (item?.externalUrl) {
          <a [href]="item!.externalUrl" target="_blank" class="btn btn-outline-secondary btn-sm">
            <i class="bx bx-link-external me-1"></i>
            View in Tracker
          </a>
        }
      </div>

      <!-- Loading -->
      @if (supportService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Error -->
      @if (supportService.error()) {
        <div class="alert alert-danger">
          {{ supportService.error() }}
        </div>
      }

      <!-- Item Detail -->
      @if (item && !supportService.loading()) {
        <div class="item-detail">
          <!-- Header Card -->
          <div class="card mb-4">
            <div class="card-body">
              <!-- Type & Status -->
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="item-type-icon" [style.background-color]="item.typeColor + '20'">
                    <i class="bx {{ item.typeIcon }}" [style.color]="item.typeColor"></i>
                  </div>
                  <span class="badge bg-light text-dark">{{ item.typeName }}</span>
                  <span class="badge" [class]="'bg-' + getPriorityVariant(item.priority) + '-subtle text-' + getPriorityVariant(item.priority)">
                    <i class="bx {{ item.priorityIcon }} me-1"></i>
                    {{ item.priorityName }} Priority
                  </span>
                </div>
                <span class="badge fs-14" [style.background-color]="item.statusColor" style="color: white;">
                  <i class="bx {{ item.statusIcon }} me-1"></i>
                  {{ item.statusName }}
                </span>
              </div>
              
              <!-- Title & Description -->
              <h3 class="mb-3">{{ item.title }}</h3>
              <p class="text-muted mb-4">{{ item.description }}</p>
              
              <!-- Progress Visualization -->
              <div class="progress-section mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted small">Progress</span>
                  <span class="badge bg-success-subtle text-success">{{ item.progressPercent }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div 
                    class="progress-bar bg-success" 
                    [style.width.%]="item.progressPercent">
                  </div>
                </div>
                
                <!-- Status Steps -->
                <div class="status-steps mt-3">
                  <div class="d-flex justify-content-between">
                    @for (status of statuses; track status.id) {
                      <div class="status-step text-center" [class.completed]="isStatusCompleted(status.id)">
                        <div class="step-dot" 
                             [style.background-color]="isStatusCompleted(status.id) ? status.color : '#e9ecef'"
                             [class.current]="item.status === status.id">
                          @if (isStatusCompleted(status.id)) {
                            <i class="bx bx-check"></i>
                          }
                        </div>
                        <div class="step-label small mt-1" [class.text-muted]="!isStatusCompleted(status.id)">
                          {{ status.name }}
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              
              <!-- Metadata -->
              <div class="row text-muted small">
                <div class="col-md-4">
                  <i class="bx bx-calendar me-1"></i>
                  Submitted: {{ item.createdAt | date:'medium' }}
                </div>
                <div class="col-md-4">
                  <i class="bx bx-refresh me-1"></i>
                  Updated: {{ item.updatedAt | date:'medium' }}
                </div>
                @if (item.resolvedAt) {
                  <div class="col-md-4">
                    <i class="bx bx-check-circle me-1"></i>
                    Resolved: {{ item.resolvedAt | date:'medium' }}
                  </div>
                }
              </div>
              
              @if (item.category) {
                <div class="mt-3">
                  <span class="badge bg-secondary-subtle text-secondary">
                    <i class="bx bx-category me-1"></i>
                    {{ item.category }}
                  </span>
                </div>
              }
              
              @if (item.assignedToName) {
                <div class="mt-3 text-muted small">
                  <i class="bx bx-user me-1"></i>
                  Assigned to: {{ item.assignedToName }}
                </div>
              }
            </div>
          </div>

          <!-- Comments Section -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bx bx-message-square-detail me-2"></i>
                Comments ({{ supportService.comments().length }})
              </h5>
            </div>
            <div class="card-body">
              <!-- Comment List -->
              @if (supportService.comments().length > 0) {
                <div class="comments-list mb-4">
                  @for (comment of supportService.comments(); track comment.id) {
                    <div class="comment-item mb-3 pb-3 border-bottom">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm me-2">
                            <span class="avatar-title rounded-circle bg-primary-subtle text-primary">
                              {{ comment.authorName.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                          <div>
                            <strong>{{ comment.authorName }}</strong>
                            @if (comment.internal) {
                              <span class="badge bg-warning-subtle text-warning ms-1">Internal</span>
                            }
                          </div>
                        </div>
                        <small class="text-muted">{{ comment.ageLabel }}</small>
                      </div>
                      <p class="mb-0 ps-5">{{ comment.content }}</p>
                    </div>
                  }
                </div>
              }
              
              @if (supportService.comments().length === 0) {
                <div class="text-center text-muted py-3 mb-4">
                  <i class="bx bx-message-square display-4"></i>
                  <p class="mt-2">No comments yet</p>
                </div>
              }
              
              <!-- Add Comment Form -->
              <div class="add-comment">
                <h6 class="mb-3">Add a Comment</h6>
                <div class="mb-3">
                  <textarea
                    class="form-control"
                    rows="3"
                    [(ngModel)]="newComment"
                    placeholder="Write your comment...">
                  </textarea>
                </div>
                <button 
                  class="btn btn-primary"
                  [disabled]="!newComment.trim() || supportService.saving()"
                  (click)="submitComment()">
                  @if (supportService.saving()) {
                    <span class="spinner-border spinner-border-sm me-1"></span>
                  }
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Not Found -->
      @if (!item && !supportService.loading() && !supportService.error()) {
        <div class="text-center py-5">
          <i class="bx bx-error-circle display-1 text-warning"></i>
          <h4 class="mt-3">Item Not Found</h4>
          <p class="text-muted">The support item you're looking for doesn't exist.</p>
          <a routerLink="../my-items" class="btn btn-primary">
            <i class="bx bx-arrow-back me-1"></i>
            Back to My Items
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .item-read {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .item-type-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .status-steps {
      position: relative;
    }
    .status-steps::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 10%;
      right: 10%;
      height: 2px;
      background: #e9ecef;
      z-index: 0;
    }
    .status-step {
      flex: 1;
      position: relative;
      z-index: 1;
    }
    .step-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      color: white;
      font-size: 12px;
    }
    .step-dot.current {
      box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.3);
    }
    
    .avatar-sm {
      width: 32px;
      height: 32px;
    }
    .avatar-title {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
  `]
})
export class ItemReadComponent implements OnInit, OnDestroy {
  supportService = inject(SupportItemService);
  private route = inject(ActivatedRoute);

  item: SupportItemViewModel | null = null;
  statuses = SUPPORT_STATUSES;
  newComment = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.supportService.loadItem(id).subscribe(item => {
          this.item = item;
          if (item) {
            this.supportService.loadComments(item.id);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.supportService.clearCurrentItem();
  }

  isStatusCompleted(statusId: string): boolean {
    if (!this.item) return false;
    const itemStatusOrder = this.statuses.find(s => s.id === this.item!.status)?.order || 0;
    const checkStatusOrder = this.statuses.find(s => s.id === statusId)?.order || 0;
    return checkStatusOrder <= itemStatusOrder;
  }

  submitComment(): void {
    if (!this.item || !this.newComment.trim()) return;
    
    this.supportService.addComment(this.item.id, this.newComment.trim())
      .subscribe(comment => {
        if (comment) {
          this.newComment = '';
        }
      });
  }

  getPriorityVariant(priority: string): string {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'secondary';
    }
  }
}
