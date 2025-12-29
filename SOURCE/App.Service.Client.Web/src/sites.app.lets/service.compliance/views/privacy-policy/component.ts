import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccountService } from '../../../../core/services/account.service';

/**
 * Privacy Policy Component
 * 
 * Displays the privacy policy document (PDF or HTML).
 * Account-aware - can load account-specific version if available.
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule, PdfViewerModule],
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
        <div>
          <span class="badge bg-info-subtle text-info">Last Updated: {{lastUpdated}}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <!-- PDF Viewer -->
          <div *ngIf="pdfSrc" class="pdf-container">
            <pdf-viewer 
              [src]="pdfSrc"
              [original-size]="false"
              [show-all]="true"
              [fit-to-page]="true"
              style="display: block; height: 80vh;">
            </pdf-viewer>
          </div>
          
          <!-- Fallback HTML Content -->
          <div *ngIf="!pdfSrc" class="html-content">
            <h5>Privacy Policy</h5>
            <p>This is a placeholder for the privacy policy content.</p>
            <p>Configure the PDF path in account settings to display the full document.</p>
          </div>
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
  styles: [`
    .policy-page {
      padding: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .pdf-container {
      border: 1px solid var(--vz-border-color);
      border-radius: 0.5rem;
      overflow: hidden;
    }
  `]
})
export class PrivacyPolicyComponent implements OnInit {
  pdfSrc?: string;
  lastUpdated = 'January 2025';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    // Try to get account-specific PDF, fallback to default
    this.accountService.getConfigValue<string>('compliance.privacyPolicy.pdf')
      .subscribe(path => {
        this.pdfSrc = path || '/assets/data/compliance/privacy-policy.pdf';
      });
  }
}
