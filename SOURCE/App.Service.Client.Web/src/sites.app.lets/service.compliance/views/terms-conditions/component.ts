import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccountService } from '../../../../core/services/account.service';

/**
 * Terms & Conditions Component
 * 
 * Displays terms from either:
 * - Markdown file (default, more portable)
 * - PDF file (if configured)
 * 
 * Configuration:
 * - compliance.terms.markdown: Path to markdown file
 * - compliance.terms.pdf: Path to PDF file (takes precedence if set)
 */
@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule, PdfViewerModule],
  template: `
    <div class="policy-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
            <i class="bx bx-arrow-back"></i>
          </a>
          <h4 class="d-inline-block mb-0">
            <i class="bx bx-file me-2 text-success"></i>
            Terms & Conditions
          </h4>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <!-- PDF Content -->
          <div *ngIf="pdfSrc" class="pdf-container">
            <pdf-viewer 
              [src]="pdfSrc"
              [original-size]="false"
              [show-all]="true"
              [fit-to-page]="true"
              style="display: block; height: 80vh;">
            </pdf-viewer>
          </div>
          
          <!-- Markdown Content (fallback) -->
          <div *ngIf="!pdfSrc && markdownSrc" class="markdown-content">
            <markdown [src]="markdownSrc"></markdown>
          </div>
          
          <!-- Fallback -->
          <div *ngIf="!pdfSrc && !markdownSrc" class="html-content">
            <h5>Terms & Conditions</h5>
            <p class="text-muted">Terms and conditions document not configured.</p>
            <p>Please contact the administrator to set up the terms document.</p>
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
    .policy-page { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }
    .pdf-container { border: 1px solid var(--vz-border-color); border-radius: 0.5rem; overflow: hidden; }
    .markdown-content { line-height: 1.8; }
    .markdown-content h1, .markdown-content h2, .markdown-content h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
  `]
})
export class TermsConditionsComponent implements OnInit {
  pdfSrc?: string;
  markdownSrc?: string;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    // Try PDF first (if configured)
    this.accountService.getConfigValue<string>('compliance.terms.pdf')
      .subscribe(pdfPath => {
        if (pdfPath) {
          this.pdfSrc = pdfPath;
        } else {
          // Fallback to markdown
          this.accountService.getConfigValue<string>('compliance.terms.markdown')
            .subscribe(mdPath => {
              this.markdownSrc = mdPath || '/assets/data/compliance/terms-conditions.md';
            });
        }
      });
  }
}
