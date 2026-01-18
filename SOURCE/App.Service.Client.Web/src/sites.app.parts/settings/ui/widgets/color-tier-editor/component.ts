/**
 * Color Tier Editor Component
 * 
 * Standalone editor for a single color tier (primary/secondary/tertiary).
 * Designed to work both as panel content and full-page view.
 * 
 * Features:
 * - Preset color swatches
 * - Custom color picker
 * - Hex input
 * - Live preview
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeColorService } from '../../../../../core/services/theme-color.service';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

export type ColorTier = 'primary' | 'secondary' | 'tertiary';

@Component({
  selector: 'app-color-tier-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseCoreAgPipesModule],
  template: `
    <div class="color-tier-editor">
      <!-- Tier info -->
      <div class="tier-header mb-4">
        <div class="d-flex align-items-center mb-2">
          <span class="color-preview me-3" [style.background-color]="color"></span>
          <div>
            <h6 class="mb-0">{{ tierLabel }}</h6>
            <small class="text-muted">{{ tierDescription }}</small>
          </div>
        </div>
      </div>
      
      <!-- Preset swatches -->
      <div class="presets-section mb-4">
        <label class="form-label small text-muted">{{ 'BASE.APPEARANCE.BRAND_COLOR.PRESETS' | baseTranslate }}</label>
        <div class="d-flex flex-wrap gap-2">
          @for (preset of colorPresets; track preset.value) {
            <button type="button" 
                    class="color-preset-btn rounded-circle border-0 p-0"
                    [style.background-color]="preset.value"
                    [class.selected]="isSelected(preset.value)"
                    [title]="preset.name"
                    (click)="selectPreset(preset.value)">
              @if (isSelected(preset.value)) {
                <i class="bx bx-check" [style.color]="getContrastColor(preset.value)"></i>
              }
            </button>
          }
        </div>
      </div>
      
      <!-- Custom color picker -->
      <div class="custom-section mb-4">
        <label class="form-label small text-muted">{{ 'BASE.APPEARANCE.BRAND_COLOR.CUSTOM' | baseTranslate }}</label>
        <div class="d-flex align-items-center gap-3">
          <input type="color" 
                 class="form-control form-control-color"
                 [(ngModel)]="color"
                 (ngModelChange)="onColorChange()">
          <input type="text" 
                 class="form-control"
                 [(ngModel)]="color"
                 (ngModelChange)="onColorChange()"
                 placeholder="#000000"
                 style="font-family: monospace; width: 120px;">
        </div>
      </div>
      
      <!-- Preview -->
      <div class="preview-section">
        <label class="form-label small text-muted">Preview</label>
        <div class="d-flex gap-3 align-items-center">
          <span class="badge rounded-pill px-3 py-2"
                [style.background-color]="color"
                [style.color]="getContrastColor(color)">
            Button
          </span>
          <span class="text-decoration-underline" [style.color]="color">Link text</span>
          <span class="border rounded px-2 py-1" [style.border-color]="color + ' !important'">Border</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .color-tier-editor {
      padding: 0.5rem 0;
    }
    
    .color-preview {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      border: 2px solid var(--vz-border-color);
    }
    
    .color-preset-btn {
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 0, 0, 0.15) !important;
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      &.selected {
        transform: scale(1.05);
        box-shadow: 0 0 0 3px var(--vz-body-bg), 0 0 0 5px currentColor;
      }
      
      i {
        font-size: 1.25rem;
      }
    }
    
    .form-control-color {
      width: 60px;
      height: 40px;
      padding: 0.25rem;
    }
    
    .preview-section {
      padding: 1rem;
      background-color: var(--vz-tertiary-bg);
      border-radius: 0.5rem;
    }
  `]
})
export class ColorTierEditorComponent implements OnInit {
  @Input() tier: ColorTier = 'primary';
  @Input() color = '#25a0e2';
  @Output() colorChange = new EventEmitter<string>();

  colorPresets: { name: string; value: string }[] = [];

  constructor(private themeColorService: ThemeColorService) {
    this.colorPresets = this.themeColorService.colorPresets;
  }

  ngOnInit(): void {}

  get tierLabel(): string {
    switch (this.tier) {
      case 'primary': return 'Primary (Brand)';
      case 'secondary': return 'Secondary (Accent)';
      case 'tertiary': return 'Tertiary (Controls)';
    }
  }

  get tierDescription(): string {
    switch (this.tier) {
      case 'primary': return 'Main brand color for sidebar and topbar';
      case 'secondary': return 'Accent color for gradients and highlights';
      case 'tertiary': return 'Color for buttons, links, and interactive elements';
    }
  }

  isSelected(presetValue: string): boolean {
    return this.color.toLowerCase() === presetValue.toLowerCase();
  }

  selectPreset(value: string): void {
    this.color = value;
    this.colorChange.emit(this.color);
  }

  onColorChange(): void {
    this.colorChange.emit(this.color);
  }

  getContrastColor(hex: string): string {
    return this.themeColorService.getContrastColor(hex);
  }
}
