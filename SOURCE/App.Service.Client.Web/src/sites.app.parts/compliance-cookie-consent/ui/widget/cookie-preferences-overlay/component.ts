/**
 * Cookie Preferences Overlay Widget
 * 
 * Full-screen modal for managing cookie consent preferences.
 * Shows all cookie categories with toggle switches.
 * 
 * Features:
 * - Category-by-category consent
 * - "Necessary" always on (required)
 * - Accept All / Save Preferences buttons
 * - Expandable category details
 * - GDPR-compliant wording
 * 
 * Usage:
 * ```html
 * <app-cookie-preferences-overlay></app-cookie-preferences-overlay>
 * ```
 * 
 * The overlay visibility is controlled by CookieConsentService.showPreferences signal.
 */
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieConsentService } from '../../../../../core/services/cookie-consent.service';
import { CookieCategoryConfig, CookieCategory } from '../../../../../core/models/cookie-consent.model';

@Component({
  selector: 'app-cookie-preferences-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Overlay Backdrop -->
    @if (consentService.showPreferences()) {
      <div class="cookie-overlay-backdrop" (click)="onBackdropClick($event)">
        <div class="cookie-overlay-modal" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="cookie-overlay-header">
            <div class="d-flex align-items-center">
              <i class="ri-settings-3-line fs-24 text-primary me-2"></i>
              <div>
                <h5 class="mb-0">Cookie Preferences</h5>
                <small class="text-muted">Manage your privacy settings</small>
              </div>
            </div>
            <button type="button" class="btn-close" (click)="close()" aria-label="Close"></button>
          </div>
          
          <!-- Body -->
          <div class="cookie-overlay-body">
            <p class="text-muted mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, 
              and analyze our traffic. You can choose which categories to allow. 
              Note that blocking some types of cookies may impact your experience.
            </p>
            
            <!-- Category Cards -->
            <div class="cookie-categories">
              @for (category of categories(); track category.id) {
                <div class="cookie-category-card" 
                     [class.expanded]="expandedCategories()[category.id]"
                     [class.disabled]="category.required">
                  <div class="category-header" (click)="toggleExpand(category.id)">
                    <div class="d-flex align-items-center flex-grow-1">
                      <div class="category-icon">
                        <i [class]="category.icon + ' fs-20'"></i>
                      </div>
                      <div class="category-info">
                        <h6 class="mb-0">
                          {{ category.name }}
                          @if (category.required) {
                            <span class="badge bg-secondary ms-2">Required</span>
                          }
                        </h6>
                        <small class="text-muted d-none d-md-inline">
                          {{ category.description | slice:0:80 }}{{ category.description.length > 80 ? '...' : '' }}
                        </small>
                      </div>
                    </div>
                    
                    <!-- Toggle -->
                    <div class="category-toggle" (click)="$event.stopPropagation()">
                      <div class="form-check form-switch">
                        <input class="form-check-input" 
                               type="checkbox" 
                               role="switch"
                               [id]="'cookie-' + category.id"
                               [checked]="categoryStates()[category.id]"
                               [disabled]="category.required"
                               (change)="onCategoryToggle(category.id, $event)">
                      </div>
                    </div>
                    
                    <!-- Expand Icon -->
                    <button type="button" class="btn btn-sm btn-light ms-2 expand-btn">
                      <i [class]="expandedCategories()[category.id] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                    </button>
                  </div>
                  
                  <!-- Expanded Details -->
                  @if (expandedCategories()[category.id]) {
                    <div class="category-details">
                      <p class="mb-2">{{ category.description }}</p>
                      @if (category.examples && category.examples.length > 0) {
                        <div class="category-examples">
                          <strong class="small">Examples:</strong>
                          <ul class="mb-0 small">
                            @for (example of category.examples; track example) {
                              <li>{{ example }}</li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
          
          <!-- Footer -->
          <div class="cookie-overlay-footer">
            <div class="d-flex flex-wrap gap-2 justify-content-between">
              <div>
                <button type="button" class="btn btn-outline-secondary" (click)="rejectAll()">
                  Reject All
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary" (click)="savePreferences()">
                  Save Preferences
                </button>
                <button type="button" class="btn btn-success" (click)="acceptAll()">
                  <i class="ri-check-line me-1"></i>
                  Accept All
                </button>
              </div>
            </div>
            
            <div class="mt-3 text-center">
              <a href="/system/compliance/privacy" class="text-muted small">
                <i class="ri-external-link-line me-1"></i>
                Read our Privacy Policy
              </a>
              <span class="text-muted mx-2">|</span>
              <a href="/system/compliance/cookies" class="text-muted small">
                <i class="ri-external-link-line me-1"></i>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cookie-overlay-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1060;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .cookie-overlay-modal {
      background: var(--vz-card-bg, #fff);
      border-radius: 0.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(-20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    .cookie-overlay-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--vz-border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .cookie-overlay-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }
    
    .cookie-overlay-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--vz-border-color);
      background: var(--vz-light, #f8f9fa);
    }
    
    .cookie-category-card {
      border: 1px solid var(--vz-border-color);
      border-radius: 0.375rem;
      margin-bottom: 0.75rem;
      transition: all 0.2s ease;
    }
    
    .cookie-category-card:hover {
      border-color: var(--vz-primary);
    }
    
    .cookie-category-card.disabled {
      background: var(--vz-light, #f8f9fa);
    }
    
    .category-header {
      padding: 1rem;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .category-icon {
      width: 40px;
      height: 40px;
      border-radius: 0.375rem;
      background: var(--vz-primary-bg-subtle, #e7f1ff);
      color: var(--vz-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .category-info {
      flex: 1;
      min-width: 0;
    }
    
    .category-toggle {
      margin-left: 1rem;
    }
    
    .expand-btn {
      opacity: 0.6;
    }
    
    .expand-btn:hover {
      opacity: 1;
    }
    
    .category-details {
      padding: 0 1rem 1rem 4.5rem;
      animation: expandIn 0.2s ease;
    }
    
    @keyframes expandIn {
      from { 
        opacity: 0; 
        max-height: 0; 
      }
      to { 
        opacity: 1; 
        max-height: 200px; 
      }
    }
    
    .category-examples {
      background: var(--vz-light, #f8f9fa);
      padding: 0.75rem;
      border-radius: 0.25rem;
      margin-top: 0.5rem;
    }
    
    .category-examples ul {
      padding-left: 1.25rem;
      margin-top: 0.25rem;
    }
    
    .form-check-input {
      width: 2.5rem;
      height: 1.25rem;
      cursor: pointer;
    }
    
    .form-check-input:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    /* Mobile adjustments */
    @media (max-width: 576px) {
      .cookie-overlay-modal {
        max-height: 100vh;
        border-radius: 0;
      }
      
      .category-details {
        padding-left: 1rem;
      }
      
      .cookie-overlay-footer .d-flex {
        flex-direction: column;
      }
    }
  `]
})
export class CookiePreferencesOverlayComponent implements OnInit {
  consentService = inject(CookieConsentService);
  
  // State
  categories = this.consentService.categories;
  categoryStates = signal<Record<CookieCategory, boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  expandedCategories = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    // Initialize states from current preferences
    const prefs = this.consentService.preferences();
    this.categoryStates.set({ ...prefs.categories });
  }

  onCategoryToggle(categoryId: CookieCategory, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.categoryStates.update(states => ({
      ...states,
      [categoryId]: checked
    }));
  }

  toggleExpand(categoryId: string): void {
    this.expandedCategories.update(expanded => ({
      ...expanded,
      [categoryId]: !expanded[categoryId]
    }));
  }

  acceptAll(): void {
    this.consentService.acceptAll();
  }

  rejectAll(): void {
    this.consentService.acceptNecessaryOnly();
  }

  savePreferences(): void {
    this.consentService.savePreferences(this.categoryStates());
  }

  close(): void {
    this.consentService.hidePreferencesModal();
  }

  onBackdropClick(event: MouseEvent): void {
    // Don't close on backdrop click - require explicit action
  }
}
