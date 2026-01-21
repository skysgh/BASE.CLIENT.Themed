/**
 * Help Hub Component
 * 
 * Main entry point for help system.
 * Shows three main sections as tiles:
 * - FAQ: Common questions and answers
 * - Wiki/Documentation: In-depth guides
 * - Support: Report issues (if enabled)
 * 
 * Uses standard PageHeader and TileHeader for consistent UI.
 * Handles external URL redirect when configured.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { HelpService } from '../../../services/help.service';
import { SupportItemService } from '../../../../support/services';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { HELP_CONSTANTS } from '../../../constants';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';
import { HubTileHeaderComponent } from '../../../../../sites/ui/widgets/hub-tile-header';

@Component({
  selector: 'app-help-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, HubTileHeaderComponent],
  template: `
    <div class="help-hub">
      <!-- Standard Page Header -->
      <app-page-header 
        title="Help Center"
        icon="bx-help-circle"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>Browse FAQs, read documentation, or contact support</ng-container>
      </app-page-header>

      <!-- Main Sections as Tiles -->
      <div class="row g-4 mb-5">
        <!-- FAQ Section -->
        <div class="col-md-6" [class.col-lg-4]="supportService.isEnabled()">
          <div class="help-tile card h-100" routerLink="faq">
            <div class="card-body">
              <app-hub-tile-header
                icon="bx-message-square-dots"
                iconBackground="bg-primary-subtle text-primary"
                title="FAQ"
                subtitle="Quick answers to common questions"
                [showValue]="false">
              </app-hub-tile-header>
              <div class="tile-action mt-3 pt-3 border-top text-end">
                <span class="text-primary small">
                  Browse FAQs <i class="bx bx-chevron-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Wiki/Documentation Section -->
        <div class="col-md-6" [class.col-lg-4]="supportService.isEnabled()">
          <div class="help-tile card h-100" routerLink="wiki">
            <div class="card-body">
              <app-hub-tile-header
                icon="bx-book-open"
                iconBackground="bg-info-subtle text-info"
                title="Documentation"
                subtitle="In-depth guides and tutorials"
                [showValue]="false">
              </app-hub-tile-header>
              <div class="tile-action mt-3 pt-3 border-top text-end">
                <span class="text-info small">
                  Browse Docs <i class="bx bx-chevron-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Section (conditional) -->
        @if (supportService.isEnabled()) {
          <div class="col-md-6 col-lg-4">
            <div class="help-tile card h-100" (click)="goToSupport()">
              <div class="card-body">
                <app-hub-tile-header
                  icon="bx-support"
                  iconBackground="bg-success-subtle text-success"
                  title="Support"
                  subtitle="Report issues or share ideas"
                  [showValue]="false">
                </app-hub-tile-header>
                <div class="tile-action mt-3 pt-3 border-top text-end">
                  <span class="text-success small">
                    Get Support <i class="bx bx-chevron-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Popular Topics -->
      @if (helpService.getFeaturedArticles().length > 0) {
        <div class="popular-section mb-5">
          <h5 class="mb-4">
            <i class="bx bx-star me-2"></i>
            Popular Topics
          </h5>
          <div class="row">
            @for (article of helpService.getFeaturedArticles(); track article.id) {
              <div class="col-md-6 col-lg-4 mb-3">
                <a 
                  [routerLink]="['wiki/article', article.id]"
                  class="card h-100 text-decoration-none topic-card">
                  <div class="card-body d-flex align-items-center">
                    <div class="topic-icon me-3">
                      <i class="bx {{ article.icon || 'bx-file' }} fs-20 text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1">{{ article.title }}</h6>
                      <p class="text-muted small mb-0 text-truncate">
                        {{ article.description }}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            }
          </div>
        </div>
      }

      <!-- Contact Footer (only if support not enabled) -->
      @if (!supportService.isEnabled()) {
        <div class="contact-footer text-center mt-5 pt-4 border-top">
          <p class="text-muted mb-3">Still need help?</p>
          <div class="d-flex justify-content-center gap-3 flex-wrap">
            <a href="mailto:support@example.com" class="btn btn-outline-secondary">
              <i class="bx bx-envelope me-1"></i>
              Email Us
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .help-hub {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .help-tile {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
        border-color: var(--vz-primary);
      }
    }
    
    .topic-card {
      transition: all 0.2s ease;
      color: inherit;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        background: var(--vz-light);
        border-color: var(--vz-primary);
      }
    }
    
    .topic-icon {
      width: 40px;
      height: 40px;
      background: var(--vz-primary-bg-subtle);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class HelpHubComponent implements OnInit {
  helpService = inject(HelpService);
  supportService = inject(SupportItemService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);

  ngOnInit(): void {
    // Check if external mode - redirect if so
    if (this.helpService.isExternal() && this.helpService.externalUrl()) {
      window.location.href = this.helpService.externalUrl()!;
      return;
    }
    
    // Load article index for featured articles
    this.helpService.loadArticleIndex();
  }

  /**
   * Navigate to Support hub using account-aware navigation
   */
  goToSupport(): void {
    this.navigationService.navigate('apps/system/support');
  }
}
