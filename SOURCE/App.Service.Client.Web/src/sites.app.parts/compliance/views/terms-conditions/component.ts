import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="policy-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-file me-2 text-success"></i>Terms & Conditions</h4>
        </div>
      </div>
      <div class="card"><div class="card-body"><p>Terms and conditions placeholder.</p></div></div>
      <div class="mt-4"><a routerLink="../" class="btn btn-outline-secondary"><i class="bx bx-arrow-back me-1"></i>Back to Compliance</a></div>
    </div>
  `,
  styles: [`.policy-page { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }`]
})
export class TermsConditionsComponent {}
