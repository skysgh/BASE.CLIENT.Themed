/**
 * Language Hub Component
 * 
 * Admin view for managing available languages.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-language-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 900px; padding: 1.5rem;">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-sm">
            <div class="avatar-title bg-info-subtle text-info rounded">
              <i class="ri-translate-2 fs-20"></i>
            </div>
          </div>
          <div>
            <h4 class="mb-0">Languages</h4>
            <p class="text-muted mb-0">
              {{ languageService.enabledCount() }} enabled
            </p>
          </div>
        </div>
        <button 
          class="btn btn-soft-primary"
          (click)="languageService.loadLanguages()">
          <i class="ri-refresh-line"></i>
        </button>
      </div>

      <!-- Loading -->
      @if (languageService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Language List -->
      @if (!languageService.loading()) {
        <div class="card">
          <div class="list-group list-group-flush">
            @for (lang of languageService.languages(); track lang.id) {
              <div class="list-group-item">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-3">
                    <img 
                      [src]="lang.flagUrl" 
                      [alt]="lang.name"
                      class="rounded"
                      style="width: 32px; height: 24px; object-fit: cover;">
                    <div>
                      <h6 class="mb-0">{{ lang.name }}</h6>
                      <small class="text-muted">
                        {{ lang.nativeName }} ({{ lang.languageCode }})
                      </small>
                    </div>
                  </div>
                  <div class="form-check form-switch">
                    <input 
                      type="checkbox" 
                      class="form-check-input"
                      [checked]="lang.enabled"
                      (change)="languageService.toggleEnabled(lang.id)">
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Info -->
        <div class="alert alert-info mt-4">
          <i class="ri-information-line me-2"></i>
          Enabled languages will be available for users to select in their preferences.
        </div>
      }
    </div>
  `
})
export class LanguageHubComponent implements OnInit {
  languageService = inject(LanguageService);
  
  ngOnInit(): void {
    this.languageService.loadLanguages();
  }
}
