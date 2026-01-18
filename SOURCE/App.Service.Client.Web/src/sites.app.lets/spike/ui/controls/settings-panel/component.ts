/**
 * Spike Settings Panel Component
 * 
 * Settings page for the Spike applet.
 * Supports three levels: service, account, user
 * - Service/Account admins can lock settings for lower levels
 * - Users see locked indicators on settings they can't change
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { SettingsPageShellComponent } from '../../../../../sites.app.parts/settings/ui/widgets/settings-page-shell';
import { SettingsLockComponent } from '../../../../../sites.app.parts/settings/ui/widgets/settings-lock';
import { SettingsLevel } from '../../../../../sites.app.parts/settings/services/applet-settings-registry.service';

export interface SpikeSettings {
  defaultViewMode: { value: 'cards' | 'table' | 'list'; locked: boolean };
  itemsPerPage: { value: number; locked: boolean };
  showArchived: { value: boolean; locked: boolean };
  defaultSortField: { value: string; locked: boolean };
  defaultSortDirection: { value: 'asc' | 'desc'; locked: boolean };
  enableAnimations: { value: boolean; locked: boolean };
  maxItemsAllowed: { value: number; locked: boolean };
}

const DEFAULT_SETTINGS: SpikeSettings = {
  defaultViewMode: { value: 'cards', locked: false },
  itemsPerPage: { value: 12, locked: false },
  showArchived: { value: false, locked: false },
  defaultSortField: { value: 'createdAt', locked: false },
  defaultSortDirection: { value: 'desc', locked: false },
  enableAnimations: { value: true, locked: false },
  maxItemsAllowed: { value: 1000, locked: true },  // Default locked by service
};

@Component({
  selector: 'app-spike-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseCoreAgPipesModule, SettingsPageShellComponent, SettingsLockComponent],
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SpikeSettingsPanelComponent implements OnInit {
  /** Current settings level (from route or default to 'user') */
  level: SettingsLevel = 'user';
  
  /** Settings with lock state */
  settings: SpikeSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  
  hasUnsavedChanges = false;
  isSaving = false;
  showSuccess = false;

  viewModeOptions = [
    { value: 'cards', labelKey: 'SPIKE.SETTINGS.VIEW_MODE.CARDS' },
    { value: 'table', labelKey: 'SPIKE.SETTINGS.VIEW_MODE.TABLE' },
    { value: 'list', labelKey: 'SPIKE.SETTINGS.VIEW_MODE.LIST' }
  ];

  itemsPerPageOptions = [6, 12, 24, 48, 100];

  sortFieldOptions = [
    { value: 'createdAt', labelKey: 'SPIKE.SETTINGS.SORT.CREATED_AT' },
    { value: 'updatedAt', labelKey: 'SPIKE.SETTINGS.SORT.UPDATED_AT' },
    { value: 'title', labelKey: 'SPIKE.SETTINGS.SORT.TITLE' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get level from route data (can be on this route or parent)
    this.route.data.subscribe(data => {
      if (data['level']) {
        this.level = data['level'];
      }
    });
    
    // Also check parent route data as fallback
    this.route.parent?.data.subscribe(data => {
      if (data['level'] && this.level === 'user') {
        this.level = data['level'];
      }
    });
    
    this.loadSettings();
  }

  /** Back route based on current level */
  get backRoute(): string {
    return `/system/settings/${this.level}`;
  }

  private loadSettings(): void {
    const stored = localStorage.getItem(`spike.settings.${this.level}`);
    if (stored) {
      try {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      }
    }
  }

  /** Can current level lock settings for lower levels? */
  get canLock(): boolean {
    return this.level === 'service' || this.level === 'account';
  }

  /** Is a field editable at current level? */
  isEditable(field: { locked: boolean }): boolean {
    // If we're at service level, everything is editable
    if (this.level === 'service') return true;
    // Otherwise, check if locked by higher level
    return !field.locked;
  }

  /** Get who locked this field (for display) */
  getLockedBy(field: { locked: boolean }): 'service' | 'account' {
    // In real app, this would come from the stored lock metadata
    // For now, assume service locked it
    return 'service';
  }

  onSettingChange(): void {
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
  }

  onSave(): void {
    this.isSaving = true;
    
    setTimeout(() => {
      localStorage.setItem(`spike.settings.${this.level}`, JSON.stringify(this.settings));
      this.hasUnsavedChanges = false;
      this.isSaving = false;
      this.showSuccess = true;
      setTimeout(() => { this.showSuccess = false; }, 3000);
    }, 300);
  }

  onReset(): void {
    this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
  }
}
