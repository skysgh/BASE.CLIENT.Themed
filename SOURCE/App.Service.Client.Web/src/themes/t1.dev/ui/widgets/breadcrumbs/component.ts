/**
 * Developer Reference Breadcrumbs Component
 * 
 * PageHeader-styled breadcrumbs component matching Velzon's selector.
 * Used for developer reference pages to keep them working without modification.
 * Now renders with PageHeader styling for consistency.
 * 
 * Selector: app-breadcrumbs (matches Velzon's component)
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-header-wrapper mb-4">
      <div class="d-flex align-items-start gap-3">
        <!-- Back Button -->
        <a routerLink=".." class="btn btn-outline-secondary btn-icon flex-shrink-0">
          <i class="bx bx-arrow-back"></i>
        </a>
        
        <!-- Icon -->
        <div class="avatar-sm flex-shrink-0">
          <div class="avatar-title rounded" [class]="iconBackground">
            <i [class]="'bx ' + icon + ' fs-20 ' + iconClass"></i>
          </div>
        </div>
        
        <!-- Title & Breadcrumb -->
        <div class="flex-grow-1">
          <h4 class="mb-1">{{ title }}</h4>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <a routerLink="/dev">Developer Hub</a>
              </li>
              <li class="breadcrumb-item">
                <a routerLink="/dev/theme/t1/minimal">Theme Reference</a>
              </li>
              @for (item of breadcrumbItems; track item) {
                <li
                  class="breadcrumb-item"
                  [class.active]="item.active">
                  @if (!item.active) {
                    <a [routerLink]="'..'">{{ item.label }}</a>
                  } @else {
                    {{ item.label }}
                  }
                </li>
              }
            </ol>
          </nav>
        </div>
      </div>
    </div>
    `,
    styles: [`
      .page-header-wrapper {
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--vz-border-color);
      }
      
      .btn-icon {
        width: 38px;
        height: 38px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .avatar-sm {
        width: 38px;
        height: 38px;
      }
      
      .avatar-title {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `]
})
export class DevBreadcrumbsComponent {
  @Input() title: string = '';
  @Input() breadcrumbItems: Array<{ label?: string; active?: boolean }> = [];
  
  // Map title to icon (simple heuristic)
  get icon(): string {
    const titleLower = this.title.toLowerCase();
    if (titleLower.includes('icon')) return 'bx-package';
    if (titleLower.includes('button')) return 'bx-pointer';
    if (titleLower.includes('chart')) return 'bx-chart';
    if (titleLower.includes('form')) return 'bx-edit';
    if (titleLower.includes('table')) return 'bx-table';
    if (titleLower.includes('map')) return 'bx-map';
    if (titleLower.includes('alert')) return 'bx-bell';
    if (titleLower.includes('card')) return 'bx-credit-card';
    if (titleLower.includes('modal')) return 'bx-window-alt';
    return 'bx-code-alt';
  }
  
  get iconBackground(): string {
    const titleLower = this.title.toLowerCase();
    if (titleLower.includes('icon')) return 'bg-info-subtle';
    if (titleLower.includes('chart')) return 'bg-success-subtle';
    if (titleLower.includes('form')) return 'bg-primary-subtle';
    if (titleLower.includes('table')) return 'bg-warning-subtle';
    if (titleLower.includes('map')) return 'bg-danger-subtle';
    return 'bg-secondary-subtle';
  }
  
  get iconClass(): string {
    const titleLower = this.title.toLowerCase();
    if (titleLower.includes('icon')) return 'text-info';
    if (titleLower.includes('chart')) return 'text-success';
    if (titleLower.includes('form')) return 'text-primary';
    if (titleLower.includes('table')) return 'text-warning';
    if (titleLower.includes('map')) return 'text-danger';
    return 'text-secondary';
  }
}
