/**
 * Support Hub Component
 * 
 * Main entry point for the support module.
 * Shows overview, quick stats, and navigation to submit/view items.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SupportItemService } from '../../services';
import { NavigationService } from '../../../../core/services/navigation.service';
import { SUPPORT_ITEM_TYPES } from '../../constants';

@Component({
  selector: 'app-support-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="support-hub">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-4 d-flex justify-content-between align-items-center">
        <button type="button" class="btn btn-primary" (click)="goToHub()">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Hub
        </button>
      </div>

      <!-- Header -->
      <div class="support-header text-center mb-5">
        <div class="support-icon-large mb-3">
          <i class="bx bx-support"></i>
        </div>
        <h2 class="mb-2">Support Center</h2>
        <p class="text-muted mb-0">
          Report issues, share ideas, and track your requests
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-5">
        <div class="col-md-3 col-6">
          <div class="card text-center h-100">
            <div class="card-body">
              <div class="display-6 text-primary mb-2">
                {{ supportService.stats().totalItems }}
              </div>
              <div class="text-muted small">Total Items</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card text-center h-100">
            <div class="card-body">
              <div class="display-6 text-warning mb-2">
                {{ supportService.stats().openItems }}
              </div>
              <div class="text-muted small">Open</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card text-center h-100">
            <div class="card-body">
              <div class="display-6 text-success mb-2">
                {{ supportService.stats().resolvedItems }}
              </div>
              <div class="text-muted small">Resolved</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card text-center h-100">
            <div class="card-body">
              <div class="display-6 text-info mb-2">
                {{ supportService.stats().ideaCount }}
              </div>
              <div class="text-muted small">Ideas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="row g-4 mb-5">
        <!-- Report Issue -->
        @if (supportService.allowIssues()) {
          <div class="col-md-4">
            <a routerLink="new/issue" class="card h-100 action-card text-decoration-none">
              <div class="card-body text-center py-4">
                <div class="action-icon bg-danger-subtle mb-3">
                  <i class="bx bx-bug text-danger fs-36"></i>
                </div>
                <h5 class="card-title mb-2 text-dark">Report an Issue</h5>
                <p class="text-muted small mb-3">
                  Found a bug or problem? Let us know.
                </p>
                <span class="btn btn-outline-danger btn-sm">
                  Report Issue
                  <i class="bx bx-chevron-right ms-1"></i>
                </span>
              </div>
            </a>
          </div>
        }

        <!-- Share Idea -->
        @if (supportService.allowIdeas()) {
          <div class="col-md-4">
            <a routerLink="new/idea" class="card h-100 action-card text-decoration-none">
              <div class="card-body text-center py-4">
                <div class="action-icon bg-primary-subtle mb-3">
                  <i class="bx bx-bulb text-primary fs-36"></i>
                </div>
                <h5 class="card-title mb-2 text-dark">Share an Idea</h5>
                <p class="text-muted small mb-3">
                  Have a suggestion? We'd love to hear it.
                </p>
                <span class="btn btn-outline-primary btn-sm">
                  Share Idea
                  <i class="bx bx-chevron-right ms-1"></i>
                </span>
              </div>
            </a>
          </div>
        }

        <!-- Share Praise -->
        <div class="col-md-4">
          <a routerLink="new/praise" class="card h-100 action-card text-decoration-none">
            <div class="card-body text-center py-4">
              <div class="action-icon bg-success-subtle mb-3">
                <i class="bx bx-heart text-success fs-36"></i>
              </div>
              <h5 class="card-title mb-2 text-dark">Share Praise</h5>
              <p class="text-muted small mb-3">
                Had a great experience? Let us know!
              </p>
              <span class="btn btn-outline-success btn-sm">
                Share Praise
                <i class="bx bx-chevron-right ms-1"></i>
              </span>
            </div>
          </a>
        </div>
      </div>

      <!-- My Items Link -->
      <div class="card mb-4">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">
              <i class="bx bx-list-ul me-2"></i>
              My Submissions
            </h5>
            <p class="text-muted mb-0 small">
              View and track your support requests
            </p>
          </div>
          <a routerLink="my-items" class="btn btn-secondary">
            View All
            <i class="bx bx-chevron-right ms-1"></i>
          </a>
        </div>
      </div>

      <!-- Recent Items Preview -->
      @if (supportService.openItems().length > 0) {
        <div class="recent-items mb-4">
          <h6 class="mb-3">
            <i class="bx bx-time me-2"></i>
            Your Open Items
          </h6>
          <div class="list-group">
            @for (item of supportService.openItems().slice(0, 3); track item.id) {
              <a 
                [routerLink]="['item', item.id]"
                class="list-group-item list-group-item-action d-flex align-items-center">
                <div class="item-icon me-3">
                  <i class="bx {{ item.typeIcon }} fs-20" [style.color]="item.typeColor"></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ item.title }}</h6>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge" [class]="'bg-' + getStatusVariant(item.status) + '-subtle text-' + getStatusVariant(item.status)">
                      {{ item.statusName }}
                    </span>
                    <span class="text-muted small">{{ item.ageLabel }}</span>
                  </div>
                </div>
                <div class="progress-indicator" style="width: 60px;">
                  <div class="progress" style="height: 4px;">
                    <div 
                      class="progress-bar bg-success" 
                      [style.width.%]="item.progressPercent">
                    </div>
                  </div>
                  <div class="text-muted text-center small mt-1">{{ item.progressPercent }}%</div>
                </div>
              </a>
            }
          </div>
          @if (supportService.openItems().length > 3) {
            <div class="text-center mt-3">
              <a routerLink="my-items" class="text-primary small">
                View all {{ supportService.openItems().length }} open items →
              </a>
            </div>
          }
        </div>
      }

      <!-- Contact Info -->
      <div class="contact-footer text-center mt-5 pt-4 border-top">
        <p class="text-muted mb-3">Need immediate assistance?</p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a href="mailto:support@example.com" class="btn btn-outline-secondary">
            <i class="bx bx-envelope me-1"></i>
            Email Support
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .support-hub {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .support-icon-large {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #17a2b8, #0d6efd);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 2.5rem;
    }
    
    .action-card {
      transition: all 0.3s ease;
      border: 1px solid var(--vz-border-color);
    }
    .action-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    
    .action-icon {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    
    .item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SupportHubComponent implements OnInit {
  supportService = inject(SupportItemService);
  private navigationService = inject(NavigationService);

  ngOnInit(): void {
    // Redirect if external mode
    if (this.supportService.isExternal() && this.supportService.externalUrl()) {
      window.location.href = this.supportService.externalUrl()!;
      return;
    }
    
    // Refresh items
    this.supportService.refresh();
  }

  goToHub(): void {
    this.navigationService.navigate('apps/system/hub');
  }

  getStatusVariant(status: string): string {
    switch (status) {
      case 'new': return 'secondary';
      case 'triaged': return 'info';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'dark';
      default: return 'secondary';
    }
  }
}
