/**
 * Developer Hub Component
 * 
 * Landing page for all developer tools.
 * Shows navigation to:
 * - Theme reference pages
 * - Integration guides
 * - Schema DSL documentation
 * - Wiki preview
 * - API documentation (future)
 * 
 * Route: /dev
 * Uses standard PageHeader for consistent navigation.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../../sites/ui/widgets/page-header';

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
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  template: `
    <div class="dev-hub container-fluid">
      <!-- Standard Page Header -->
      <app-page-header 
        title="Developer Hub"
        icon="bx-code-alt"
        iconBackground="bg-dark"
        iconClass="text-white"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>Documentation, guides, and reference materials</ng-container>
        <ng-container actions>
          <a href="https://github.com/skysgh/BASE.CLIENT.Themed" target="_blank" class="btn btn-outline-dark btn-sm">
            <i class="bx bxl-github me-1"></i>
            GitHub
          </a>
        </ng-container>
      </app-page-header>

      <!-- Warning -->
      <div class="alert alert-warning border-0 d-flex align-items-center mb-4" role="alert">
        <i class="bx bx-wrench fs-20 me-2"></i>
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
                      <i class="bx bx-chevron-right text-muted me-2"></i>
                      <div class="flex-grow-1">
                        <span>{{ item.title }}</span>
                        @if (item.description) {
                          <small class="text-muted d-block">{{ item.description }}</small>
                        }
                      </div>
                      <i class="bx bx-link-external text-muted"></i>
                    </a>
                  }
                </div>
                <div class="mt-3 text-end">
                  <a [routerLink]="section.route" class="link-primary">
                    View all {{ section.title.toLowerCase() }}
                    <i class="bx bx-right-arrow-alt ms-1"></i>
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
          <h5 class="mb-0"><i class="bx bx-link me-2"></i>Quick Links</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <a routerLink="/dev/theme/t1/minimal" class="btn btn-soft-primary w-100">
                <i class="bx bx-palette me-2"></i>Theme Reference
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="/dev/guides/schema-dsl" class="btn btn-soft-info w-100">
                <i class="bx bx-data me-2"></i>Schema DSL Guide
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="/dev/wiki" class="btn btn-soft-success w-100">
                <i class="bx bx-book-open me-2"></i>Wiki Preview
              </a>
            </div>
            <div class="col-md-3">
              <a href="https://github.com/skysgh/BASE.CLIENT.Themed" target="_blank" class="btn btn-soft-dark w-100">
                <i class="bx bxl-github me-2"></i>GitHub Repo
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
      id: 'guides',
      title: 'Developer Guides',
      description: 'Schema DSL, patterns, and best practices',
      icon: 'ri-book-read-line',
      iconBg: '#299cdb',
      route: 'guides',
      badge: 'Docs',
      items: [
        { title: 'Schema DSL Guide', route: 'schema-dsl', description: 'Entity schemas for BREAD pattern' },
        { title: 'Overview & Concepts', route: 'schema-dsl/overview', description: 'Understanding schema-driven UI' },
        { title: 'Entity Definition', route: 'schema-dsl/entity', description: 'Fields, lookups, data source' },
        { title: 'Browse View Schema', route: 'schema-dsl/browse', description: 'Filters, sorting, display modes' },
        { title: 'Form Schemas', route: 'schema-dsl/forms', description: 'Edit/Add/View with Formly' },
      ]
    },
    {
      id: 'wiki',
      title: 'Wiki Preview',
      description: 'Test wiki functionality with mock data',
      icon: 'ri-book-open-line',
      iconBg: '#f7b84b',
      route: 'wiki',
      badge: 'Preview',
      items: [
        { title: 'Wiki Hub', route: '', description: 'Browse namespaces and recent pages' },
        { title: 'Public Docs', route: 'public', description: 'Public documentation namespace' },
        { title: 'Getting Started', route: 'public/getting-started', description: 'Sample wiki page' },
        { title: 'API Reference', route: 'public/api-reference', description: 'Sample API docs page' },
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
