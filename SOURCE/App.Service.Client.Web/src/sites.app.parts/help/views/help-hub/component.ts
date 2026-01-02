/**
 * Help Hub Component
 * 
 * Main entry point for help system.
 * Shows two main sections:
 * - FAQ: Common questions and answers
 * - Wiki: Documentation articles
 * 
 * Also links to Support (if enabled).
 * Handles external URL redirect when configured.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HelpService } from '../../services/help.service';
import { SupportItemService } from '../../../support/services';
import { NavigationService } from '../../../../core/services/navigation.service';
import { HELP_CONSTANTS } from '../../constants';

@Component({
  selector: 'app-help-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="help-hub">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-4 d-flex justify-content-between align-items-center">
        <button type="button" class="btn btn-primary" (click)="goBack()">
          <i class="bx bx-arrow-back me-1"></i>
          Back
        </button>
        
        <!-- Culture/Language Selector (future enhancement) -->
        <div class="d-flex gap-2 align-items-center">
          <span class="badge bg-light text-secondary">
            <i class="bx bx-globe me-1"></i>
            {{ helpService.currentCulture() }}
          </span>
        </div>
      </div>

      <!-- Header -->
      <div class="help-header text-center mb-5">
        <div class="help-icon-large mb-3">
          <i class="bx bx-help-circle"></i>
        </div>
        <h2 class="mb-2">How can we help you?</h2>
        <p class="text-muted mb-4">
          Browse FAQs, read documentation, or contact support
        </p>
        <p class="text-muted small">
          <i class="bx bx-info-circle me-1"></i>
          Tip: Use the search in the toolbar to find help articles.
        </p>
      </div>

      <!-- Main Sections -->
      <div class="row g-4 mb-5">
        <!-- FAQ Section -->
        <div class="col-md-6" [class.col-lg-4]="supportService.isEnabled()">
          <div class="card h-100 section-card" routerLink="faq" style="cursor: pointer;">
            <div class="card-body text-center py-5">
              <div class="section-icon bg-primary-subtle mb-4">
                <i class="bx bx-message-square-dots text-primary fs-48"></i>
              </div>
              <h4 class="card-title mb-3">FAQ</h4>
              <p class="text-muted mb-4">
                Quick answers to common questions.
              </p>
              <span class="btn btn-outline-primary">
                Browse FAQs
                <i class="bx bx-chevron-right ms-1"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Wiki/Documentation Section -->
        <div class="col-md-6" [class.col-lg-4]="supportService.isEnabled()">
          <div class="card h-100 section-card" routerLink="wiki" style="cursor: pointer;">
            <div class="card-body text-center py-5">
              <div class="section-icon bg-info-subtle mb-4">
                <i class="bx bx-book-open text-info fs-48"></i>
              </div>
              <h4 class="card-title mb-3">Documentation</h4>
              <p class="text-muted mb-4">
                In-depth guides and tutorials.
              </p>
              <span class="btn btn-outline-info">
                Browse Docs
                <i class="bx bx-chevron-right ms-1"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Support Section (conditional) -->
        @if (supportService.isEnabled()) {
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 section-card" (click)="goToSupport()" style="cursor: pointer;">
              <div class="card-body text-center py-5">
                <div class="section-icon bg-success-subtle mb-4">
                  <i class="bx bx-support text-success fs-48"></i>
                </div>
                <h4 class="card-title mb-3">Support</h4>
                <p class="text-muted mb-4">
                  Report issues or share ideas.
                </p>
                <span class="btn btn-outline-success">
                  Get Support
                  <i class="bx bx-chevron-right ms-1"></i>
                </span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Popular Topics (when not searching) -->
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
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .help-icon-large {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--vz-primary), #764ba2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 2.5rem;
    }
    
    .section-card {
      transition: all 0.3s ease;
      border: 1px solid var(--vz-border-color);
    }
    .section-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      border-color: var(--vz-primary);
    }
    
    .section-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    
    .topic-card {
      transition: all 0.2s ease;
      color: inherit;
      border: 1px solid var(--vz-border-color);
    }
    .topic-card:hover {
      background: var(--vz-light);
      border-color: var(--vz-primary);
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
  private location = inject(Location);

  ngOnInit(): void {
    // Check if external mode - redirect if so
    if (this.helpService.isExternal() && this.helpService.externalUrl()) {
      window.location.href = this.helpService.externalUrl()!;
      return;
    }
    
    // Load article index for featured articles
    this.helpService.loadArticleIndex();
  }

  goBack(): void {
    this.location.back();
  }

  /**
   * Navigate to Support hub using account-aware navigation
   */
  goToSupport(): void {
    this.navigationService.navigate('apps/system/support');
  }
}
