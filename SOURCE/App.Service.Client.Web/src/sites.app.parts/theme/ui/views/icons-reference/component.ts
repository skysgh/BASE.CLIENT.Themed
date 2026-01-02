import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Icons Reference Component
 * 
 * BoxIcons reference with search
 */
@Component({
    selector: 'app-icons-reference',
    imports: [RouterModule, FormsModule],
    template: `
    <div class="icons-reference">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
          <i class="bx bx-arrow-back"></i>
        </a>
        <h3 class="mb-0">
          <i class="bx bx-shape-circle me-2 text-success"></i>
          Icons Reference
        </h3>
      </div>
    
      <div class="alert alert-info mb-4">
        <i class="bx bx-info-circle me-2"></i>
        We use <strong>BoxIcons</strong>. Full reference:
        <a href="https://boxicons.com/" target="_blank">boxicons.com</a>
      </div>
    
      <!-- Search -->
      <div class="mb-4">
        <input
          type="text"
          class="form-control form-control-lg"
          placeholder="Search icons (e.g., 'user', 'edit', 'chart')..."
          [(ngModel)]="searchTerm"
          (input)="onSearch()">
        </div>
    
        <!-- Common Icons -->
        <h5>Common Icons</h5>
        <div class="row mb-4">
          @for (icon of filteredIcons; track icon) {
            <div class="col-4 col-md-2 mb-3">
              <div class="icon-card text-center p-3">
                <i class="bx {{icon.class}} fs-24"></i>
                <div class="mt-2">
                  <code class="small">{{icon.class}}</code>
                </div>
              </div>
            </div>
          }
        </div>
    
        <!-- Usage -->
        <h5>Usage</h5>
        <div class="card">
          <div class="card-body">
            <pre class="mb-0"><code>// In HTML template
              &lt;i class="bx bx-user"&gt;&lt;/i&gt;
              &lt;i class="bx bx-edit text-primary"&gt;&lt;/i&gt;
              &lt;i class="bx bxs-star text-warning"&gt;&lt;/i&gt;
    
              // Icon prefixes:
              // bx-  = Regular
              // bxs- = Solid
            // bxl- = Logo</code></pre>
          </div>
        </div>
      </div>
    `,
    styles: [`
    .icons-reference {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .icon-card {
      background: var(--vz-card-bg);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--vz-primary);
        background: var(--vz-primary-bg-subtle);
      }
      
      i {
        color: var(--vz-body-color);
      }
    }
  `]
})
export class IconsReferenceComponent {
  searchTerm = '';
  
  allIcons = [
    { class: 'bx-user', name: 'user' },
    { class: 'bx-edit', name: 'edit' },
    { class: 'bx-trash', name: 'trash' },
    { class: 'bx-plus', name: 'plus' },
    { class: 'bx-search', name: 'search' },
    { class: 'bx-home', name: 'home' },
    { class: 'bx-cog', name: 'cog settings' },
    { class: 'bx-save', name: 'save' },
    { class: 'bx-x', name: 'x close' },
    { class: 'bx-check', name: 'check' },
    { class: 'bx-folder', name: 'folder' },
    { class: 'bx-file', name: 'file' },
    { class: 'bx-calendar', name: 'calendar date' },
    { class: 'bx-time', name: 'time clock' },
    { class: 'bx-bulb', name: 'bulb idea' },
    { class: 'bx-chart', name: 'chart' },
    { class: 'bx-bar-chart-alt-2', name: 'bar chart' },
    { class: 'bx-grid-alt', name: 'grid cards' },
    { class: 'bx-list-ul', name: 'list' },
    { class: 'bx-table', name: 'table' },
    { class: 'bx-arrow-back', name: 'arrow back' },
    { class: 'bx-chevron-right', name: 'chevron right' },
    { class: 'bx-dots-vertical-rounded', name: 'dots menu' },
    { class: 'bx-refresh', name: 'refresh reload' },
  ];

  filteredIcons = [...this.allIcons];

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredIcons = this.allIcons.filter(icon => 
      icon.name.includes(term) || icon.class.includes(term)
    );
  }
}
