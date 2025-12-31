import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Theme Hub Component
 * 
 * Main landing page for theme reference.
 */
@Component({
    selector: 'app-theme-hub',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="theme-hub">
      <div class="page-header mb-4">
        <h2>
          <i class="bx bx-palette me-2 text-primary"></i>
          Theme Reference
        </h2>
        <p class="text-muted">
          Reference guide for theme components, colors, icons, and typography.
          Use this to build consistent UIs.
        </p>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let section of sections">
          <div class="card h-100 section-card" [routerLink]="section.route">
            <div class="card-body text-center">
              <div class="section-icon mb-3" [style.background-color]="section.color">
                <i class="bx {{section.icon}}"></i>
              </div>
              <h5>{{section.title}}</h5>
              <p class="text-muted small mb-0">{{section.description}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 p-4 bg-light rounded">
        <h5><i class="bx bx-info-circle me-2"></i>For Applet Developers</h5>
        <p class="mb-0 text-muted">
          This reference shows what's available in the theme. 
          When building your applet, use these consistent styles and components.
          Don't reinvent the wheel!
        </p>
      </div>
    </div>
  `,
    styles: [`
    .theme-hub {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
    }
    
    .section-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      
      i {
        font-size: 1.5rem;
        color: white;
      }
    }
  `]
})
export class ThemeHubComponent {
  sections = [
    {
      title: 'Colors',
      description: 'Color palette and usage guidelines',
      icon: 'bx-palette',
      color: '#3577f1',
      route: 'colors'
    },
    {
      title: 'Icons',
      description: 'BoxIcons reference and search',
      icon: 'bx-shape-circle',
      color: '#0ab39c',
      route: 'icons'
    },
    {
      title: 'Typography',
      description: 'Font styles, headings, and text utilities',
      icon: 'bx-font',
      color: '#f06548',
      route: 'typography'
    },
    {
      title: 'Components',
      description: 'Buttons, cards, badges, and more',
      icon: 'bx-extension',
      color: '#299cdb',
      route: 'components'
    },
    {
      title: 'Forms',
      description: 'Form fields and validation styles',
      icon: 'bx-edit',
      color: '#f7b84b',
      route: 'forms'
    },
  ];
}
