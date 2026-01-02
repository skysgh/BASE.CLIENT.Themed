/**
 * Developer Hub Component
 * 
 * Landing page for all developer tools.
 * Shows navigation to:
 * - Theme reference pages
 * - Integration guides
 * - API documentation (future)
 * 
 * Route: /dev
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DevSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  route: string;
  badge?: string;
  items: { title: string; route: string; description?: string }[];
}

@Component({
  selector: 'app-dev-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dev-hub container-fluid">
      <!-- Header -->
      <div class="page-header mb-4">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="avatar-sm">
              <div class="avatar-title bg-dark rounded">
                <i class="ri-code-s-slash-line fs-20 text-white"></i>
              </div>
            </div>
          </div>
          <div class="col">
            <h4 class="mb-1">Developer Hub</h4>
            <p class="text-muted mb-0">Documentation, guides, and reference materials</p>
          </div>
        </div>
      </div>

      <!-- Warning -->
      <div class="alert alert-warning border-0 d-flex align-items-center mb-4" role="alert">
        <i class="ri-tools-line fs-20 me-2"></i>
        <div>
          <strong>Developer Tools</strong> - These pages are for development reference only 
          and should not be used in production features.
        </div>
      </div>

      <!-- Sections Grid -->
      <div class="row">
        @for (section of sections; track section.id) {
          <div class="col-xl-6 col-lg-12 mb-4">
            <div class="card h-100">
              <div class="card-header d-flex align-items-center">
                <div class="avatar-sm me-3">
                  <div class="avatar-title rounded" [style.background]="section.iconBg">
                    <i [class]="section.icon + ' fs-20 text-white'"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h5 class="card-title mb-0">{{ section.title }}</h5>
                  <p class="text-muted mb-0 small">{{ section.description }}</p>
                </div>
                @if (section.badge) {
                  <span class="badge bg-soft-primary text-primary">{{ section.badge }}</span>
                }
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  @for (item of section.items; track item.route) {
                    <a [routerLink]="section.route + '/' + item.route" 
                       class="list-group-item list-group-item-action d-flex align-items-center">
                      <i class="ri-arrow-right-s-line text-muted me-2"></i>
                      <div class="flex-grow-1">
                        <span>{{ item.title }}</span>
                        @if (item.description) {
                          <small class="text-muted d-block">{{ item.description }}</small>
                        }
                      </div>
                      <i class="ri-external-link-line text-muted"></i>
                    </a>
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

      <!-- Quick Links -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0"><i class="ri-links-line me-2"></i>Quick Links</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <a routerLink="/dev/theme/t1/minimal" class="btn btn-soft-primary w-100">
                <i class="ri-palette-line me-2"></i>Theme Reference
              </a>
            </div>
            <div class="col-md-4">
              <a routerLink="/dev/integrations/auth" class="btn btn-soft-success w-100">
                <i class="ri-shield-keyhole-line me-2"></i>Auth Integration
              </a>
            </div>
            <div class="col-md-4">
              <a href="https://github.com/skysgh/BASE.CLIENT.Themed" target="_blank" class="btn btn-soft-dark w-100">
                <i class="ri-github-line me-2"></i>GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dev-hub {
      padding: 1.5rem;
      max-width: 1400px;
    }
    
    .card {
      transition: all 0.2s;
    }
    
    .card:hover {
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
    
    .list-group-item {
      padding: 0.75rem 0;
      border-left: 0;
      border-right: 0;
    }
    
    .list-group-item:first-child {
      border-top: 0;
    }
  `]
})
export class DevHubComponent {
  
  sections: DevSection[] = [
    {
      id: 'theme',
      title: 'Theme Reference',
      description: 'Velzon theme components, icons, and examples',
      icon: 'ri-palette-line',
      iconBg: '#8772f9',
      route: 'theme/t1/minimal',
      badge: 'Velzon',
      items: [
        { title: 'Icons', route: 'icons', description: 'Remix, BoxIcons, Material Design, Feather' },
        { title: 'UI Components', route: 'ui', description: 'Buttons, Cards, Alerts, Modals' },
        { title: 'Charts', route: 'charts', description: 'ApexCharts, Chart.js, ECharts' },
        { title: 'Forms', route: 'forms', description: 'Inputs, Pickers, Validation' },
        { title: 'Tables', route: 'tables', description: 'Grid.js, List.js' },
        { title: 'Maps', route: 'maps', description: 'Leaflet, Google Maps' },
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'How to connect external services',
      icon: 'ri-plug-line',
      iconBg: '#00bd9d',
      route: 'integrations',
      badge: 'Guides',
      items: [
        { title: 'Authentication', route: 'auth', description: 'OIDC, OAuth2, Local auth' },
        { title: 'Microsoft OIDC', route: 'auth/microsoft', description: 'Azure AD / Entra ID setup' },
        { title: 'Google OIDC', route: 'auth/google', description: 'Google Identity Platform' },
        { title: 'GitHub OAuth', route: 'auth/github', description: 'GitHub OAuth App setup' },
        { title: 'Local Auth', route: 'auth/local', description: 'Email/password authentication' },
      ]
    }
  ];
}
