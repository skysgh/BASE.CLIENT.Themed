import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

/**
 * Components Reference Component
 */
@Component({
    selector: 'app-components-reference',
    imports: [RouterModule],
    template: `
    <div class="components-reference">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
          <i class="bx bx-arrow-back"></i>
        </a>
        <h3 class="mb-0">
          <i class="bx bx-extension me-2 text-info"></i>
          Components
        </h3>
      </div>

      <!-- Buttons -->
      <div class="card mb-4">
        <div class="card-header">Buttons</div>
        <div class="card-body">
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-success">Success</button>
            <button class="btn btn-danger">Danger</button>
            <button class="btn btn-warning">Warning</button>
            <button class="btn btn-info">Info</button>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button class="btn btn-outline-primary">Outline</button>
            <button class="btn btn-soft-primary">Soft</button>
            <button class="btn btn-ghost-primary">Ghost</button>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-primary btn-sm">Small</button>
            <button class="btn btn-primary">Default</button>
            <button class="btn btn-primary btn-lg">Large</button>
          </div>
        </div>
      </div>

      <!-- Badges -->
      <div class="card mb-4">
        <div class="card-header">Badges</div>
        <div class="card-body">
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="badge bg-primary">Primary</span>
            <span class="badge bg-secondary">Secondary</span>
            <span class="badge bg-success">Success</span>
            <span class="badge bg-danger">Danger</span>
            <span class="badge bg-warning">Warning</span>
            <span class="badge bg-info">Info</span>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span class="badge bg-primary-subtle text-primary">Subtle Primary</span>
            <span class="badge bg-success-subtle text-success">Subtle Success</span>
            <span class="badge bg-danger-subtle text-danger">Subtle Danger</span>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div class="card mb-4">
        <div class="card-header">Cards</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Card Title</h5>
                  <p class="card-text text-muted">Some content here.</p>
                  <a href="#" class="btn btn-primary btn-sm">Action</a>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">With Header</div>
                <div class="card-body">Content</div>
                <div class="card-footer">Footer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div class="card mb-4">
        <div class="card-header">Alerts</div>
        <div class="card-body">
          <div class="alert alert-primary"><i class="bx bx-info-circle me-2"></i>Primary alert</div>
          <div class="alert alert-success"><i class="bx bx-check-circle me-2"></i>Success alert</div>
          <div class="alert alert-danger"><i class="bx bx-error me-2"></i>Danger alert</div>
          <div class="alert alert-warning"><i class="bx bx-error-circle me-2"></i>Warning alert</div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .components-reference {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class ComponentsReferenceComponent {}
