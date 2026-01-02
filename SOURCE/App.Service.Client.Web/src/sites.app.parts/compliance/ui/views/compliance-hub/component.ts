import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

/**
 * Compliance Hub Component
 * 
 * Landing page for all compliance/legal documents.
 */
@Component({
    selector: 'app-compliance-hub',
    imports: [RouterModule],
    template: `
    <div class="compliance-hub">
      <div class="page-header mb-4">
        <h2>
          <i class="bx bx-shield-quarter me-2 text-primary"></i>
          Legal & Compliance
        </h2>
        <p class="text-muted">
          View our policies, terms, and compliance documentation.
        </p>
      </div>
    
      <div class="row">
        @for (doc of documents; track doc) {
          <div class="col-md-4 mb-4">
            <div class="card h-100 doc-card" [routerLink]="doc.route">
              <div class="card-body">
                <div class="doc-icon mb-3" [style.background-color]="doc.color">
                  <i class="bx {{doc.icon}}"></i>
                </div>
                <h5>{{doc.title}}</h5>
                <p class="text-muted small mb-0">{{doc.description}}</p>
              </div>
            </div>
          </div>
        }
      </div>
    
      <div class="mt-4">
        <a routerLink="/app" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Apps
        </a>
      </div>
    </div>
    `,
    styles: [`
    .compliance-hub { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
    .doc-card { cursor: pointer; transition: all 0.2s ease; border: 1px solid var(--vz-border-color); }
    .doc-card:hover { border-color: var(--vz-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transform: translateY(-2px); }
    .doc-icon { width: 50px; height: 50px; border-radius: 0.5rem; display: inline-flex; align-items: center; justify-content: center; }
    .doc-icon i { font-size: 1.25rem; color: white; }
  `]
})
export class ComplianceHubComponent {
  documents = [
    { title: 'Privacy Policy', description: 'How we collect, use, and protect your personal data.', icon: 'bx-lock-alt', color: '#3577f1', route: 'privacy' },
    { title: 'Terms & Conditions', description: 'Terms of service and usage agreements.', icon: 'bx-file', color: '#0ab39c', route: 'terms' },
    { title: 'Cookie Policy', description: 'How we use cookies and tracking technologies.', icon: 'bx-cookie', color: '#f7b84b', route: 'cookies' },
    { title: 'Accessibility', description: 'Our commitment to accessibility standards.', icon: 'bx-accessibility', color: '#299cdb', route: 'accessibility' },
    { title: 'Data Collection', description: 'What data we collect and why.', icon: 'bx-data', color: '#f06548', route: 'data-collection' },
  ];
}
