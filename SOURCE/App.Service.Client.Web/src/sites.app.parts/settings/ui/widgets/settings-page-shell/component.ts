/**
 * Settings Page Shell Component
 * 
 * Provides consistent wrapper for all applet settings pages:
 * - Header: Back button (primary/blue) + Combined title + Actions
 * - Actions: Reset to Defaults + Save button (top right)
 * 
 * The applet content goes in the middle via ng-content.
 * Applet emits events for save/reset, shell handles UI state.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

@Component({
  selector: 'app-settings-page-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseCoreAgPipesModule],
  template: `
    <div class="settings-page-shell">
      <!-- Header -->
      <div class="settings-header mb-4">
        <!-- Top Row: Back + Actions -->
        <div class="header-actions d-flex justify-content-between align-items-center mb-3">
          <a [routerLink]="backRoute" class="btn btn-primary btn-sm">
            <i class="bx bx-arrow-back me-1"></i>
            {{ 'BASE.NAVIGATION.BACK' | baseTranslate }}
          </a>
          
          <div class="d-flex gap-2">
            <button type="button" 
                    class="btn btn-outline-secondary btn-sm"
                    [disabled]="isSaving"
                    (click)="reset.emit()">
              <i class="bx bx-reset me-1"></i>
              {{ 'BASE.ACTIONS.RESET_DEFAULTS' | baseTranslate }}
            </button>
            
            <button type="button" 
                    class="btn btn-success btn-sm"
                    [disabled]="!hasChanges || isSaving"
                    (click)="save.emit()">
              @if (isSaving) {
                <span class="spinner-border spinner-border-sm me-1" role="status"></span>
              } @else {
                <i class="bx bx-save me-1"></i>
              }
              {{ 'BASE.ACTIONS.SAVE' | baseTranslate }}
            </button>
          </div>
        </div>
        
        <!-- Title Row: Combined "User Preferences - Spike Settings" -->
        <div class="title-row d-flex align-items-center">
          <div class="avatar-sm me-3">
            <div class="avatar-title bg-primary-subtle text-primary rounded">
              <i class="bx {{ icon }} fs-20"></i>
            </div>
          </div>
          <div>
            <h4 class="mb-1">
              <span class="text-muted">{{ contextKey | baseTranslate }}</span>
              <span class="mx-2 text-muted">—</span>
              <span>{{ titleKey | baseTranslate }}</span>
            </h4>
            <p class="text-muted mb-0">{{ descriptionKey | baseTranslate }}</p>
          </div>
        </div>
      </div>

      <!-- Content (applet settings) -->
      <div class="settings-content">
        <ng-content></ng-content>
      </div>
      
      <!-- Success Message -->
      @if (showSuccess) {
        <div class="alert alert-success mt-3 d-flex align-items-center">
          <i class="bx bx-check-circle me-2 fs-20"></i>
          {{ 'BASE.MESSAGES.SETTINGS_SAVED' | baseTranslate }}
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-page-shell {
      .settings-header {
        .header-actions {
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--vz-border-color);
        }
        
        .title-row {
          padding-top: 0.5rem;
          
          h4 {
            font-weight: 500;
          }
        }
      }

      .settings-content {
        padding: 1rem 0;
      }
    }
  `]
})
export class SettingsPageShellComponent {
  /** i18n key for page title */
  @Input() titleKey = '';
  
  /** i18n key for description */
  @Input() descriptionKey = '';
  
  /** Icon class */
  @Input() icon = 'bx-cog';
  
  /** Route to navigate back to */
  @Input() backRoute = '/system/settings/user';
  
  /** Context level: 'service' | 'account' | 'user' */
  @Input() context: 'service' | 'account' | 'user' = 'user';
  
  /** Whether there are unsaved changes */
  @Input() hasChanges = false;
  
  /** Whether save is in progress */
  @Input() isSaving = false;
  
  /** Show success message */
  @Input() showSuccess = false;
  
  /** Emitted when Save is clicked */
  @Output() save = new EventEmitter<void>();
  
  /** Emitted when Reset is clicked */
  @Output() reset = new EventEmitter<void>();
  
  /** Get context display key */
  get contextKey(): string {
    const keys = {
      'service': 'BASE.SETTINGS.SERVICE.TITLE',
      'account': 'BASE.SETTINGS.ACCOUNT.TITLE',
      'user': 'BASE.SETTINGS.USER.TITLE'
    };
    return keys[this.context];
  }
}
