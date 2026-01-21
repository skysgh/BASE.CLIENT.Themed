/**
 * Color Editor Page Component
 * 
 * Full-page color editor for mobile devices.
 * Receives tier from route params and loads/saves via parent's stored settings.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResponsivePanelPageComponent } from '../../../../../sites/ui/widgets/responsive-panel-shell';
import { ColorTierEditorComponent, ColorTier } from '../../widgets/color-tier-editor';
import { ThemeColorService, ThemeColorConfig, DEFAULT_THEME_COLORS } from '../../../../../core/services/theme-color.service';

@Component({
  selector: 'app-color-editor-page',
  standalone: true,
  imports: [CommonModule, ResponsivePanelPageComponent, ColorTierEditorComponent],
  template: `
    <app-responsive-panel-page
      [title]="title"
      (saved)="onSave()"
      (cancelled)="onCancel()">
      
      <app-color-tier-editor
        [tier]="tier"
        [(color)]="color"
        (colorChange)="onColorChange($event)">
      </app-color-tier-editor>
      
    </app-responsive-panel-page>
  `
})
export class ColorEditorPageComponent implements OnInit {
  tier: ColorTier = 'primary';
  color = '';
  level = 'user';
  
  private originalColor = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private themeColorService: ThemeColorService
  ) {}

  ngOnInit(): void {
    // Get tier from route params
    this.route.params.subscribe(params => {
      this.tier = params['tier'] as ColorTier || 'primary';
      this.loadColor();
    });
    
    // Get level from parent route data
    this.route.parent?.data.subscribe(data => {
      if (data['level']) {
        this.level = data['level'];
        this.loadColor();
      }
    });
  }

  get title(): string {
    switch (this.tier) {
      case 'primary': return 'Edit Primary Color';
      case 'secondary': return 'Edit Secondary Color';
      case 'tertiary': return 'Edit Tertiary Color';
    }
  }

  private loadColor(): void {
    const stored = localStorage.getItem(`appearance.settings.${this.level}`);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        switch (this.tier) {
          case 'primary': this.color = settings.primaryColor?.value || DEFAULT_THEME_COLORS.primaryColor; break;
          case 'secondary': this.color = settings.secondaryColor?.value || DEFAULT_THEME_COLORS.secondaryColor; break;
          case 'tertiary': this.color = settings.tertiaryColor?.value || DEFAULT_THEME_COLORS.tertiaryColor; break;
        }
      } catch {
        this.color = DEFAULT_THEME_COLORS.primaryColor;
      }
    } else {
      switch (this.tier) {
        case 'primary': this.color = DEFAULT_THEME_COLORS.primaryColor; break;
        case 'secondary': this.color = DEFAULT_THEME_COLORS.secondaryColor; break;
        case 'tertiary': this.color = DEFAULT_THEME_COLORS.tertiaryColor; break;
      }
    }
    this.originalColor = this.color;
  }

  onColorChange(color: string): void {
    this.color = color;
    // Live preview
    this.applyPreview();
  }

  private applyPreview(): void {
    const stored = localStorage.getItem(`appearance.settings.${this.level}`);
    let settings: any = {};
    if (stored) {
      try { settings = JSON.parse(stored); } catch {}
    }
    
    const config: ThemeColorConfig = {
      primaryColor: this.tier === 'primary' ? this.color : (settings.primaryColor?.value || DEFAULT_THEME_COLORS.primaryColor),
      secondaryColor: this.tier === 'secondary' ? this.color : (settings.secondaryColor?.value || DEFAULT_THEME_COLORS.secondaryColor),
      tertiaryColor: this.tier === 'tertiary' ? this.color : (settings.tertiaryColor?.value || DEFAULT_THEME_COLORS.tertiaryColor),
      sidebarColorSource: settings.sidebarColorSource?.value || 'primary',
      topbarColorSource: settings.topbarColorSource?.value || 'primary',
      controlsColorSource: settings.controlsColorSource?.value || 'tertiary',
    };
    this.themeColorService.applyThemeColors(config);
  }

  onSave(): void {
    // Save to localStorage
    const stored = localStorage.getItem(`appearance.settings.${this.level}`);
    let settings: any = {};
    if (stored) {
      try { settings = JSON.parse(stored); } catch {}
    }
    
    switch (this.tier) {
      case 'primary': settings.primaryColor = { value: this.color, locked: false }; break;
      case 'secondary': settings.secondaryColor = { value: this.color, locked: false }; break;
      case 'tertiary': settings.tertiaryColor = { value: this.color, locked: false }; break;
    }
    
    localStorage.setItem(`appearance.settings.${this.level}`, JSON.stringify(settings));
    this.location.back();
  }

  onCancel(): void {
    // Restore original color
    this.color = this.originalColor;
    this.applyPreview();
    this.location.back();
  }
}
