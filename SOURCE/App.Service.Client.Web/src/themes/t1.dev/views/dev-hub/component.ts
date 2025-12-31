/**
 * Theme T1 Developer Hub Component
 * 
 * Landing page for Theme T1 developer reference.
 * Provides navigation to all reference modules.
 * 
 * Route: /apps/dev/theme/t1/minimal
 */
import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

interface ReferenceSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  route: string;
  badge?: string;
  items: ReferenceItem[];
}

interface ReferenceItem {
  title: string;
  route: string;
}

@Component({
    selector: 'app-t1-dev-hub',
    imports: [RouterModule],
    template: `
    <div class="dev-hub">
      <!-- Header -->
      <div class="page-header mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-sm">
            <div class="avatar-title bg-primary-subtle text-primary rounded">
              <i class="ri-palette-line fs-20"></i>
            </div>
          </div>
          <div>
            <h4 class="mb-1">Theme T1 Developer Reference</h4>
            <p class="text-muted mb-0">Velzon theme components, icons, and examples</p>
          </div>
        </div>
      </div>
    
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/dev">Developer</a></li>
          <li class="breadcrumb-item"><a routerLink="/apps/dev/theme/t1">Theme T1</a></li>
          <li class="breadcrumb-item active">Minimal</li>
        </ol>
      </nav>
    
      <!-- Theme Info Card -->
      <div class="card bg-primary-subtle border-0 mb-4">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-md">
              <div class="avatar-title bg-primary rounded-circle">
                <i class="ri-layout-masonry-line fs-24"></i>
              </div>
            </div>
            <div class="flex-grow-1">
              <h5 class="mb-1">Velzon - Minimal Variant</h5>
              <p class="text-muted mb-0">
                Angular admin dashboard template from ThemeForest.
                This is the <strong>Minimal</strong> style with <strong>Vertical</strong> layout.
              </p>
            </div>
            <a href="https://themeforest.net/item/velzon-aspnet-core-admin-dashboard-template/36077495"
              target="_blank"
              class="btn btn-primary">
              <i class="ri-external-link-line me-1"></i>
              View on ThemeForest
            </a>
          </div>
        </div>
      </div>
    
      <!-- Reference Sections -->
      <div class="row">
        @for (section of sections; track section) {
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <div class="avatar-sm me-3">
                  <div class="avatar-title rounded" [style.background]="section.iconColor">
                    <i [class]="section.icon + ' fs-20 text-white'"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h5 class="card-title mb-0">{{ section.title }}</h5>
                  <p class="text-muted mb-0 small">{{ section.description }}</p>
                </div>
                @if (section.badge) {
                  <span class="badge bg-soft-success text-success">
                    {{ section.badge }}
                  </span>
                }
              </div>
              <div class="card-body">
                <div class="row g-2">
                  @for (item of section.items; track item) {
                    <div class="col-6 col-md-4">
                      <a [routerLink]="section.route + '/' + item.route"
                        class="btn btn-soft-secondary w-100 text-start">
                        <i class="ri-arrow-right-s-line me-1"></i>
                        {{ item.title }}
                      </a>
                    </div>
                  }
                </div>
                <div class="mt-3 text-end">
                  <a [routerLink]="section.route" class="link-primary">
                    View all {{ section.title.toLowerCase() }}
                    <i class="ri-arrow-right-line ms-1"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    
      <!-- Developer Warning -->
      <div class="alert alert-warning border-0 d-flex align-items-center mt-4" role="alert">
        <i class="ri-tools-line fs-20 me-2"></i>
        <div>
          <strong>Developer Tool</strong> - This section is for reference only and should not be used in production features.
        </div>
      </div>
    </div>
    `,
    styles: [`
    .dev-hub {
      padding: 1.5rem;
      max-width: 1200px;
    }
    
    .card {
      transition: all 0.2s;
    }
    
    .card:hover {
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
    
    .btn-soft-secondary {
      font-size: 0.85rem;
      padding: 0.5rem 0.75rem;
    }
    
    .btn-soft-secondary:hover {
      background: var(--vz-primary-bg-subtle);
      color: var(--vz-primary);
    }
  `]
})
export class T1DevHubComponent {
  
  sections: ReferenceSection[] = [
    {
      id: 'icons',
      title: 'Icons',
      description: 'Icon libraries available in the theme',
      icon: 'ri-remixicon-line',
      iconColor: '#8772f9',
      route: 'icons',
      badge: '6 Libraries',
      items: [
        { title: 'Remix Icons', route: 'remix' },
        { title: 'BoxIcons', route: 'boxicons' },
        { title: 'Material Design', route: 'materialdesign' },
        { title: 'Feather', route: 'feather' },
        { title: 'Line Awesome', route: 'lineawesome' },
        { title: 'Crypto Icons', route: 'icons-crypto' },
      ]
    },
    {
      id: 'ui',
      title: 'UI Components',
      description: 'Bootstrap and custom components',
      icon: 'ri-layout-grid-line',
      iconColor: '#25a0e2',
      route: 'ui',
      badge: '24 Components',
      items: [
        { title: 'Buttons', route: 'buttons' },
        { title: 'Cards', route: 'cards' },
        { title: 'Alerts', route: 'alerts' },
        { title: 'Modals', route: 'modals' },
        { title: 'Tabs', route: 'tabs' },
        { title: 'Progress', route: 'progress' },
      ]
    },
    {
      id: 'charts',
      title: 'Charts',
      description: 'Data visualization components',
      icon: 'ri-bar-chart-2-line',
      iconColor: '#00bd9d',
      route: 'charts',
      items: [
        { title: 'Line Charts', route: 'apex-line' },
        { title: 'Bar Charts', route: 'apex-bar' },
        { title: 'Pie Charts', route: 'apex-pie' },
        { title: 'Chart.js', route: 'chartjs' },
        { title: 'ECharts', route: 'echarts' },
      ]
    },
    {
      id: 'forms',
      title: 'Forms',
      description: 'Form elements and layouts',
      icon: 'ri-checkbox-line',
      iconColor: '#FFBC0A',
      route: 'forms',
      items: [
        { title: 'Basic Elements', route: 'basic' },
        { title: 'Select', route: 'select' },
        { title: 'Pickers', route: 'pickers' },
        { title: 'Validation', route: 'validation' },
        { title: 'Wizard', route: 'wizard' },
        { title: 'File Uploads', route: 'file-uploads' },
      ]
    },
    {
      id: 'tables',
      title: 'Tables',
      description: 'Data tables and grids',
      icon: 'ri-table-line',
      iconColor: '#516196',
      route: 'tables',
      items: [
        { title: 'Basic Tables', route: 'basic' },
        { title: 'Grid.js', route: 'gridjs' },
        { title: 'List.js', route: 'listjs' },
      ]
    },
    {
      id: 'maps',
      title: 'Maps',
      description: 'Map integrations',
      icon: 'ri-map-pin-line',
      iconColor: '#f06548',
      route: 'maps',
      items: [
        { title: 'Leaflet', route: 'leaflet' },
        { title: 'Google Maps', route: 'google' },
      ]
    },
  ];
}
