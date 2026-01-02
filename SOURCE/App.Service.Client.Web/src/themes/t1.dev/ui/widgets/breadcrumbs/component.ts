/**
 * Simple Breadcrumbs Component (Dev Reference)
 * 
 * Minimal breadcrumbs component matching Velzon's selector.
 * Used for developer reference pages to keep them working without modification.
 * 
 * Selector: app-breadcrumbs (matches Velzon's component)
 */
import { Component, Input } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-breadcrumbs',
    imports: [RouterModule],
    template: `
    <div class="row">
      <div class="col-12">
        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 class="mb-sm-0">{{ title }}</h4>
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <a routerLink="/apps/dev">Developer</a>
              </li>
              @for (item of breadcrumbItems; track item) {
                <li
                  class="breadcrumb-item"
                  [class.active]="item.active">
                  {{ item.label }}
                </li>
              }
            </ol>
          </div>
        </div>
      </div>
    </div>
    `
})
export class DevBreadcrumbsComponent {
  @Input() title: string = '';
  @Input() breadcrumbItems: Array<{ label?: string; active?: boolean }> = [];
}
