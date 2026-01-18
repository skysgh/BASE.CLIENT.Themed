/**
 * Settings Lock Indicator / Toggle Component
 * 
 * Two modes:
 * 1. VIEW mode (locked=true): Shows lock icon + who locked it
 * 2. EDIT mode (canLock=true): Shows checkbox to lock for lower levels
 * 
 * Usage - View locked setting:
 * ```html
 * <app-settings-lock [locked]="true" lockedBy="service"></app-settings-lock>
 * ```
 * 
 * Usage - Toggle lock (service/account admin):
 * ```html
 * <app-settings-lock [canLock]="true" [(isLocked)]="field.locked"></app-settings-lock>
 * ```
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

@Component({
  selector: 'app-settings-lock',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseCoreAgPipesModule],
  template: `
    <!-- View Mode: Show lock indicator (for users viewing locked settings) -->
    @if (locked && !canLock) {
      <span class="settings-lock-view" [title]="'Locked by ' + lockedBy + ' admin'">
        <i class="bx bx-lock-alt"></i>
        <span class="lock-label">{{ lockedByKey | baseTranslate }}</span>
      </span>
    }
    
    <!-- Edit Mode: Show lock toggle checkbox (for admins who can lock) -->
    @if (canLock) {
      <label class="settings-lock-toggle" [title]="'BASE.SETTINGS.LOCK_FOR_LOWER_LEVELS' | baseTranslate">
        <input type="checkbox" 
               class="form-check-input"
               [checked]="isLocked"
               (change)="onToggle($event)">
        <i class="bx" [class.bx-lock-alt]="isLocked" [class.bx-lock-open-alt]="!isLocked"></i>
      </label>
    }
  `,
  styles: [`
    .settings-lock-view {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.7rem;
      color: var(--vz-secondary);
      margin-left: 0.5rem;
      
      i { font-size: 0.8rem; }
      
      .lock-label {
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    .settings-lock-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      cursor: pointer;
      margin-left: 0.5rem;
      
      input {
        width: 14px;
        height: 14px;
        margin: 0;
      }
      
      i {
        font-size: 0.9rem;
        color: var(--vz-secondary);
      }
      
      input:checked + i {
        color: var(--vz-warning);
      }
    }
  `]
})
export class SettingsLockComponent {
  /** Is this setting currently locked? (view mode) */
  @Input() locked = false;
  
  /** Which level locked it: 'service' or 'account' (view mode) */
  @Input() lockedBy: 'service' | 'account' = 'service';
  
  /** Can the current user lock this setting? (edit mode) */
  @Input() canLock = false;
  
  /** Is this setting locked by current admin? (edit mode, two-way binding) */
  @Input() isLocked = false;
  @Output() isLockedChange = new EventEmitter<boolean>();
  
  /** Get i18n key for locked by label */
  get lockedByKey(): string {
    return this.lockedBy === 'service' 
      ? 'BASE.SETTINGS.SERVICE.TITLE' 
      : 'BASE.SETTINGS.ACCOUNT.TITLE';
  }
  
  onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.isLocked = checked;
    this.isLockedChange.emit(checked);
  }
}
