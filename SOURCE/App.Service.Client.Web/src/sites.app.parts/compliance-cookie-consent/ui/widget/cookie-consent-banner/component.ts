/**
 * Cookie Consent Banner Widget
 * 
 * Bottom banner that appears on first visit to request cookie consent.
 * Provides quick Accept All / Reject All buttons, plus link to preferences.
 * 
 * Features:
 * - Non-intrusive fixed bottom banner
 * - Accept All / Necessary Only quick options
 * - Customize link to open full preferences
 * - Dismissible after making a choice
 * 
 * Usage:
 * ```html
 * <app-cookie-consent-banner></app-cookie-consent-banner>
 * ```
 * 
 * Add to your root layout component. Banner visibility is controlled 
 * by CookieConsentService.showBanner signal.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieConsentService } from '../../../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (consentService.showBanner()) {
      <div class="cookie-banner">
        <div class="cookie-banner-content">
          <div class="cookie-banner-text">
            <div class="d-flex align-items-center mb-2">
              <i class="ri-cookie-line fs-24 text-warning me-2"></i>
              <h6 class="mb-0">We value your privacy</h6>
            </div>
            <p class="mb-0 text-muted small">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. 
              <a href="/system/compliance/cookies" class="link-primary">Learn more</a>
            </p>
          </div>
          
          <div class="cookie-banner-actions">
            <button type="button" 
                    class="btn btn-sm btn-outline-secondary" 
                    (click)="openPreferences()">
              <i class="ri-settings-3-line me-1 d-none d-sm-inline"></i>
              Customize
            </button>
            <button type="button" 
                    class="btn btn-sm btn-secondary" 
                    (click)="rejectAll()">
              Necessary Only
            </button>
            <button type="button" 
                    class="btn btn-sm btn-success" 
                    (click)="acceptAll()">
              <i class="ri-check-line me-1"></i>
              Accept All
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--vz-card-bg, #fff);
      border-top: 1px solid var(--vz-border-color);
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1050;
      padding: 1rem 1.5rem;
      animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(100%);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .cookie-banner-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    
    .cookie-banner-text {
      flex: 1;
    }
    
    .cookie-banner-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
      .cookie-banner {
        padding: 1rem;
      }
      
      .cookie-banner-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      
      .cookie-banner-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .cookie-banner-actions .btn {
        flex: 1;
        min-width: 100px;
      }
    }
    
    /* Dark mode support */
    :host-context(.dark-mode) .cookie-banner,
    :host-context([data-layout-mode="dark"]) .cookie-banner {
      background: var(--vz-card-bg-dark, #1a1d21);
      border-color: var(--vz-border-color-dark);
    }
  `]
})
export class CookieConsentBannerComponent {
  consentService = inject(CookieConsentService);

  acceptAll(): void {
    this.consentService.acceptAll();
  }

  rejectAll(): void {
    this.consentService.acceptNecessaryOnly();
  }

  openPreferences(): void {
    this.consentService.openPreferencesFromBanner();
  }
}
