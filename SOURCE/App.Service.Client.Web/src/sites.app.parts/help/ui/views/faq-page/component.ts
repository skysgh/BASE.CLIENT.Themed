/**
 * Help FAQ Page Component
 * 
 * Full FAQ page within the Help section.
 * Uses the reusable FaqViewerComponent from core.ag.
 * Uses standard PageHeader for consistent navigation.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FaqViewerComponent, FaqCategoryConfig } from '../../../../../core.ag/ui/widgets/faq-viewer';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-help-faq-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FaqViewerComponent, PageHeaderComponent],
  template: `
    <div class="faq-page">
      <!-- Standard Page Header -->
      <app-page-header 
        title="Frequently Asked Questions"
        icon="bx-message-square-dots"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>Find answers to common questions about using the platform</ng-container>
      </app-page-header>

      <!-- FAQ Viewer Component -->
      <app-faq-viewer
        [showHeader]="false"
        [showCategories]="true"
        [categories]="categories"
        [columns]="2"
        [showContactLink]="true"
        contactLink="/system/support">
      </app-faq-viewer>
    </div>
  `,
  styles: [`
    .faq-page {
      padding: 1.5rem;
      max-width: 1200px;
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
