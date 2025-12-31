import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="policy-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
            <i class="bx bx-arrow-back"></i>
          </a>
          <h4 class="d-inline-block mb-0">
            <i class="bx bx-lock-alt me-2 text-primary"></i>
            Privacy Policy
          </h4>
        </div>
        <span class="badge bg-info-subtle text-info">Last Updated: January 2025</span>
      </div>

      <div class="card">
        <div class="card-body">
          <p>This is a placeholder for the privacy policy content.</p>
          <p>Configure the document path in settings to display the full policy.</p>
        </div>
      </div>

      <div class="mt-4">
        <a routerLink="../" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Compliance
        </a>
      </div>
    </div>
  `,
  styles: [`.policy-page { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }`]
})
export class PrivacyPolicyComponent implements OnInit {
  ngOnInit(): void {}
}
