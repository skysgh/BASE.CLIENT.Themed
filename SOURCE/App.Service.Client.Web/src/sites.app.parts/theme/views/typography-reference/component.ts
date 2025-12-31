import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Typography Reference Component
 */
@Component({
    selector: 'app-typography-reference',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="typography-reference">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
          <i class="bx bx-arrow-back"></i>
        </a>
        <h3 class="mb-0">
          <i class="bx bx-font me-2 text-danger"></i>
          Typography
        </h3>
      </div>

      <!-- Headings -->
      <div class="card mb-4">
        <div class="card-header">Headings</div>
        <div class="card-body">
          <h1>h1. Heading</h1>
          <h2>h2. Heading</h2>
          <h3>h3. Heading</h3>
          <h4>h4. Heading</h4>
          <h5>h5. Heading</h5>
          <h6>h6. Heading</h6>
        </div>
      </div>

      <!-- Text Styles -->
      <div class="card mb-4">
        <div class="card-header">Text Utilities</div>
        <div class="card-body">
          <p class="text-primary">.text-primary</p>
          <p class="text-secondary">.text-secondary</p>
          <p class="text-success">.text-success</p>
          <p class="text-danger">.text-danger</p>
          <p class="text-warning">.text-warning</p>
          <p class="text-info">.text-info</p>
          <p class="text-muted">.text-muted</p>
          <p class="fw-bold">.fw-bold</p>
          <p class="fw-semibold">.fw-semibold</p>
          <p class="fw-light">.fw-light</p>
          <p class="fst-italic">.fst-italic</p>
          <p class="text-uppercase">.text-uppercase</p>
          <p><small>.small or &lt;small&gt;</small></p>
        </div>
      </div>

      <!-- Font Sizes -->
      <div class="card mb-4">
        <div class="card-header">Font Sizes</div>
        <div class="card-body">
          <p class="fs-10">.fs-10 (10px)</p>
          <p class="fs-11">.fs-11 (11px)</p>
          <p class="fs-12">.fs-12 (12px)</p>
          <p class="fs-13">.fs-13 (13px)</p>
          <p class="fs-14">.fs-14 (14px)</p>
          <p class="fs-15">.fs-15 (15px)</p>
          <p class="fs-16">.fs-16 (16px)</p>
          <p class="fs-18">.fs-18 (18px)</p>
          <p class="fs-20">.fs-20 (20px)</p>
          <p class="fs-24">.fs-24 (24px)</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .typography-reference {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class TypographyReferenceComponent {}
