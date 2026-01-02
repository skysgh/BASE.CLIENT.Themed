/**
 * Help FAQ Page Component
 * 
 * Full FAQ page within the Help section.
 * Uses the reusable FaqViewerComponent from core.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FaqViewerComponent, FaqCategoryConfig } from '../../../../../core/components/faq-viewer';

@Component({
  selector: 'app-help-faq-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FaqViewerComponent],
  template: `
    <div class="faq-page">
      <!-- Top Navigation Bar (Primary: Back to Help) -->
      <div class="top-nav-bar mb-4 d-flex justify-content-between align-items-center">
        <a routerLink=".." class="btn btn-primary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Help
        </a>
      </div>

      <!-- FAQ Viewer Component -->
      <app-faq-viewer
        [showHeader]="true"
        title="Frequently Asked Questions"
        description="Find answers to common questions about using the platform."
        [showCategories]="true"
        [categories]="categories"
        [columns]="2"
        [showContactLink]="true"
        contactLink="/system/settings/support">
      </app-faq-viewer>
    </div>
  `,
  styles: [`
    .faq-page {
      padding: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }
  `]
})
export class HelpFaqPageComponent {
  // Category configuration - could be loaded from config in the future
  categories: FaqCategoryConfig[] = [
    { 
      id: '00000000-0000-0000-0000-000000000001', 
      name: 'General Questions',
      iconClass: 'ri-question-line fs-24 align-middle text-success me-1'
    },
    { 
      id: '00000000-0000-0000-0000-000000000002', 
      name: 'Privacy & Security',
      iconClass: 'ri-shield-keyhole-line fs-24 align-middle text-success me-1'
    },
    { 
      id: '00000000-0000-0000-0000-000000000003', 
      name: 'Account & Billing',
      iconClass: 'ri-user-settings-line fs-24 align-middle text-success me-1'
    },
    { 
      id: '00000000-0000-0000-0000-000000000004', 
      name: 'Technical Support',
      iconClass: 'ri-tools-line fs-24 align-middle text-success me-1'
    },
  ];
}
