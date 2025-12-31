import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Colors Reference Component
 */
@Component({
  selector: 'app-colors-reference',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="colors-reference">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
          <i class="bx bx-arrow-back"></i>
        </a>
        <h3 class="mb-0">
          <i class="bx bx-palette me-2 text-primary"></i>
          Color Palette
        </h3>
      </div>

      <!-- Primary Colors -->
      <h5>Primary Colors</h5>
      <div class="row mb-4">
        <div class="col-6 col-md-2 mb-3" *ngFor="let color of primaryColors">
          <div class="color-swatch" [style.background-color]="color.hex">
            <span class="color-label">{{color.name}}</span>
          </div>
          <div class="text-center mt-2">
            <small class="text-muted">{{color.hex}}</small>
            <br>
            <code class="small">{{color.css}}</code>
          </div>
        </div>
      </div>

      <!-- Status Colors -->
      <h5>Status Colors</h5>
      <div class="row mb-4">
        <div class="col-6 col-md-2 mb-3" *ngFor="let color of statusColors">
          <div class="color-swatch" [style.background-color]="color.hex">
            <span class="color-label">{{color.name}}</span>
          </div>
          <div class="text-center mt-2">
            <small class="text-muted">{{color.hex}}</small>
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <h5>Usage</h5>
      <div class="card">
        <div class="card-body">
          <pre class="mb-0"><code>// CSS Variable
color: var(--vz-primary);

// Bootstrap Class
&lt;button class="btn btn-primary"&gt;...&lt;/button&gt;
&lt;span class="text-success"&gt;...&lt;/span&gt;
&lt;div class="bg-danger-subtle"&gt;...&lt;/div&gt;</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .colors-reference {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .color-swatch {
      height: 80px;
      border-radius: 0.5rem;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      .color-label {
        color: white;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
    }
  `]
})
export class ColorsReferenceComponent {
  primaryColors = [
    { name: 'Primary', hex: '#3577f1', css: '--vz-primary' },
    { name: 'Secondary', hex: '#74788d', css: '--vz-secondary' },
    { name: 'Success', hex: '#0ab39c', css: '--vz-success' },
    { name: 'Info', hex: '#299cdb', css: '--vz-info' },
    { name: 'Warning', hex: '#f7b84b', css: '--vz-warning' },
    { name: 'Danger', hex: '#f06548', css: '--vz-danger' },
  ];

  statusColors = [
    { name: 'Draft', hex: '#6c757d' },
    { name: 'Submitted', hex: '#3577f1' },
    { name: 'Approved', hex: '#0ab39c' },
    { name: 'Rejected', hex: '#f06548' },
    { name: 'Archived', hex: '#343a40' },
  ];
}
