/**
 * Hub Settings Panel Component
 * 
 * Admin UI for configuring Hub view settings.
 * Shows at Service or Account level based on user's permissions.
 * 
 * Features:
 * - Reorder widgets (drag-drop)
 * - Toggle widget visibility
 * - Lock settings for lower tiers
 */
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { HubService } from '../../../services';
import { HubWidgetConfig, HubViewSettingsLock } from '../../../models';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';

type AdminTier = 'service' | 'account';

interface WidgetSettingRow {
  widget: HubWidgetConfig;
  visible: boolean;
  locked: boolean;
}

@Component({
  selector: 'app-hub-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="hub-settings-panel">
      <!-- Tier Selector (for multi-tier admins) -->
      <div class="mb-4">
        <label class="form-label fw-medium">Editing Settings For:</label>
        <div class="btn-group" role="group">
          <input type="radio" class="btn-check" name="tier" id="tier-account" 
                 [checked]="currentTier() === 'account'" 
                 (change)="setTier('account')">
          <label class="btn btn-outline-primary btn-sm" for="tier-account">
            <i class="bx bx-building me-1"></i>
            Account
          </label>
          
          <input type="radio" class="btn-check" name="tier" id="tier-service" 
                 [checked]="currentTier() === 'service'"
                 (change)="setTier('service')"
                 [disabled]="!canEditServiceLevel()">
          <label class="btn btn-outline-primary btn-sm" for="tier-service"
                 [class.disabled]="!canEditServiceLevel()">
            <i class="bx bx-server me-1"></i>
            Service (Default)
          </label>
        </div>
        <small class="text-muted d-block mt-1">
          @if (currentTier() === 'service') {
            Service settings are defaults for all accounts.
          } @else {
            Account settings override service defaults for this organization.
          }
        </small>
      </div>

      <!-- Display Mode -->
      <div class="mb-4">
        <label class="form-label fw-medium">Display Mode</label>
        <select class="form-select form-select-sm" 
                [(ngModel)]="displayMode"
                (ngModelChange)="onDisplayModeChange($event)">
          <option value="tiles">Tiles (Default)</option>
          <option value="grid">Grid</option>
          <option value="list">List</option>
          <option value="compact">Compact</option>
        </select>
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" id="lockDisplayMode"
                 [(ngModel)]="locks.displayMode"
                 (ngModelChange)="onLockChange()">
          <label class="form-check-label small" for="lockDisplayMode">
            <i class="bx bx-lock-alt me-1"></i>
            Lock display mode (prevent changes by lower tiers)
          </label>
        </div>
      </div>

      <!-- Widget Order & Visibility -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label class="form-label fw-medium mb-0">Widget Order & Visibility</label>
          <div class="form-check form-check-inline mb-0">
            <input class="form-check-input" type="checkbox" id="lockOrder"
                   [(ngModel)]="locks.widgetOrder"
                   (ngModelChange)="onLockChange()">
            <label class="form-check-label small" for="lockOrder">
              <i class="bx bx-lock-alt me-1"></i>
              Lock order
            </label>
          </div>
        </div>
        
        <div class="widget-list border rounded" cdkDropList (cdkDropListDropped)="onDrop($event)">
          @for (row of widgetRows(); track row.widget.id; let i = $index) {
            <div class="widget-row d-flex align-items-center gap-3 p-2 border-bottom" cdkDrag>
              <i class="bx bx-grid-vertical text-muted" cdkDragHandle></i>
              
              <div class="widget-icon-sm bg-light rounded">
                <i [class]="row.widget.icon"></i>
              </div>
              
              <div class="flex-grow-1">
                <span class="fw-medium">{{ row.widget.title }}</span>
                <small class="text-muted d-block">{{ row.widget.appletId }}</small>
              </div>
              
              <!-- Visibility toggle -->
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox"
                       [checked]="row.visible"
                       (change)="toggleVisibility(row.widget.id)">
              </div>
              
              <!-- Lock this specific widget -->
              <button class="btn btn-sm" 
                      [class.btn-outline-secondary]="!row.locked"
                      [class.btn-warning]="row.locked"
                      (click)="toggleWidgetLock(row.widget.id)"
                      title="Lock this widget">
                <i class="bx" [class.bx-lock-open-alt]="!row.locked" [class.bx-lock-alt]="row.locked"></i>
              </button>
            </div>
          }
        </div>
        
        <small class="text-muted mt-2 d-block">
          <i class="bx bx-info-circle me-1"></i>
          Drag to reorder. Locked widgets cannot be reordered or hidden by users.
        </small>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-secondary btn-sm" (click)="resetToDefaults()">
          <i class="bx bx-reset me-1"></i>
          Reset to Defaults
        </button>
        <button class="btn btn-primary btn-sm" (click)="saveSettings()">
          <i class="bx bx-save me-1"></i>
          Save Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hub-settings-panel {
      padding: 1rem;
    }
    
    .widget-icon-sm {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    
    .widget-row {
      background: var(--vz-card-bg);
      transition: background 0.2s;
    }
    
    .widget-row:hover {
      background: var(--vz-light);
    }
    
    .widget-row:last-child {
      border-bottom: none !important;
    }
    
    .widget-row.cdk-drag-preview {
      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2);
    }
    
    .widget-list.cdk-drop-list-dragging .widget-row:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class HubSettingsPanelComponent implements OnInit {
  private hubService = inject(HubService);

  // Current editing tier
  currentTier = signal<AdminTier>('account');
  
  // Display mode
  displayMode = 'tiles';
  
  // Lock settings
  locks: HubViewSettingsLock = {
    displayMode: false,
    widgetOrder: false,
    widgetVisibility: false,
    lockedWidgets: [],
  };
  
  // Widget rows for editing
  widgetRows = signal<WidgetSettingRow[]>([]);

  ngOnInit(): void {
    this.loadCurrentSettings();
  }

  /**
   * Check if user can edit service-level settings
   * (Would check actual permissions in production)
   */
  canEditServiceLevel(): boolean {
    // TODO: Check user's actual permissions
    return true; // For now, allow
  }

  /**
   * Switch editing tier
   */
  setTier(tier: AdminTier): void {
    this.currentTier.set(tier);
    this.loadCurrentSettings();
  }

  /**
   * Load settings for current tier
   */
  private loadCurrentSettings(): void {
    // Get current widgets from service
    const allWidgets = this.hubService.getAllWidgets();
    const settings = this.hubService.viewSettings();
    
    // Build widget rows
    this.widgetRows.set(allWidgets.map(item => ({
      widget: item.widget,
      visible: item.visible,
      locked: item.locked,
    })));
    
    // Load display mode and locks
      this.displayMode = settings.displayMode;
      const settingsLocked = settings.locked;
      this.locks = {
        displayMode: settingsLocked?.displayMode ?? false,
        widgetOrder: settingsLocked?.widgetOrder ?? false,
        widgetVisibility: settingsLocked?.widgetVisibility ?? false,
        lockedWidgets: settingsLocked?.lockedWidgets ?? [],
      };
    }

  /**
   * Handle drag-drop reorder
   */
  onDrop(event: CdkDragDrop<WidgetSettingRow[]>): void {
    const rows = [...this.widgetRows()];
    moveItemInArray(rows, event.previousIndex, event.currentIndex);
    this.widgetRows.set(rows);
  }

  /**
   * Toggle widget visibility
   */
  toggleVisibility(widgetId: string): void {
    this.widgetRows.update(rows => 
      rows.map(r => r.widget.id === widgetId 
        ? { ...r, visible: !r.visible } 
        : r
      )
    );
  }

  /**
   * Toggle widget-specific lock
   */
  toggleWidgetLock(widgetId: string): void {
    if (!this.locks.lockedWidgets) {
      this.locks.lockedWidgets = [];
    }
    
    const index = this.locks.lockedWidgets.indexOf(widgetId);
    if (index >= 0) {
      this.locks.lockedWidgets.splice(index, 1);
    } else {
      this.locks.lockedWidgets.push(widgetId);
    }
    
    // Update row
    this.widgetRows.update(rows =>
      rows.map(r => r.widget.id === widgetId
        ? { ...r, locked: index < 0 }
        : r
      )
    );
  }

  /**
   * Handle display mode change
   */
  onDisplayModeChange(mode: string): void {
    this.displayMode = mode;
  }

  /**
   * Handle lock change
   */
  onLockChange(): void {
    // Locks are bound via ngModel
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    if (confirm('Reset all hub settings to defaults?')) {
      this.loadCurrentSettings();
    }
  }

  /**
     * Save settings to current tier
     */
    saveSettings(): void {
      const widgets = this.widgetRows().map(r => ({
        id: r.widget.id,
        visible: r.visible,
      }));
    
      const settings = {
        displayMode: this.displayMode as any,
        widgets,
        locked: this.locks,
      };
    
      const tier = this.currentTier();
      this.logger.debug(`[HubSettingsPanel] Saving ${tier} settings: ${JSON.stringify(settings)}`);
    
      if (tier === 'service') {
        // Save to service level (sysadmin)
        this.hubService.saveServiceSettings(settings as any);
      } else if (tier === 'account') {
        // Save to account level (account admin)
        this.hubService.saveAccountSettings(settings);
      } else {
        // Save to user level (default)
        this.hubService.updateUserViewSettings(widgets);
      }
    
      // Provide feedback
      alert(`${tier.charAt(0).toUpperCase() + tier.slice(1)} settings saved!`);
    }

    private logger = inject(SystemDiagnosticsTraceService);
  }
