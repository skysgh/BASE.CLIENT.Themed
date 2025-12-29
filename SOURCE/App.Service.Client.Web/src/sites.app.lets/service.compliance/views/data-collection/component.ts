import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccountService } from '../../../../core/services/account.service';

/**
 * Data Collection Statement Component
 */
@Component({
  selector: 'app-data-collection',
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
            <i class="bx bx-data me-2 text-danger"></i>
            Data Collection Statement
          </h4>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div *ngIf="pdfSrc" class="pdf-container">
            <pdf-viewer 
              [src]="pdfSrc"
              [original-size]="false"
              [show-all]="true"
              [fit-to-page]="true"
              style="display: block; height: 80vh;">
            </pdf-viewer>
          </div>
          
          <div *ngIf="!pdfSrc" class="html-content">
            <h5>Data Collection Statement</h5>
            <p>Details about data we collect and how it's used.</p>
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
  `]
})
export class DataCollectionComponent implements OnInit {
  pdfSrc?: string;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getConfigValue<string>('compliance.dataCollection.pdf')
      .subscribe(path => {
        this.pdfSrc = path || '/assets/data/compliance/data-collection.pdf';
      });
  }
}
