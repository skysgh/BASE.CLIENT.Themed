/**
 * Appearance Settings Panel Component
 * 
 * Settings page for appearance/theme preferences.
 * Uses ResponsiveEditorHost for color editing (panel on desktop, page on mobile).
 */
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { SettingsPageShellComponent } from '../../widgets/settings-page-shell';
import { SettingsLockComponent } from '../../widgets/settings-lock';
import { SettingsLevel } from '../../../services/applet-settings-registry.service';
import { themesT1Constants } from '../../../../../themes/t1/constants/implementations/themes.t1.constants';
import { ThemeColorService, ThemeColorConfig, DEFAULT_THEME_COLORS } from '../../../../../core/services/theme-color.service';
import { ResponsiveEditorHostComponent, ResponsiveEditorContentDirective } from '../../../../../core.ag/ui/widgets/responsive-editor';
import { ColorTierEditorComponent, ColorTier } from '../../widgets/color-tier-editor';

// NgRx actions and selectors
import {
  changeMode, changelayout, changeLayoutWidth, changeLayoutPosition,
  changeTopbar, changeSidebarSize, changeSidebarView, changeSidebarColor,
  changeSidebarImage, changeDataPreloader
} from '../../../../../themes/t1/_state/layout/layout-action';

import {
  getLayoutTheme, getLayoutMode, getLayoutWith, getLayoutPosition,
  getTopbarColor, getSidebarSize, getSidebarView, getSidebarColor,
  getSidebarImage, getPreloader
} from '../../../../../themes/t1/_state/layout/layout-selector';

interface SettingField<T> {
  value: T;
  locked: boolean;
}

interface AppearanceSettings {
  mode: SettingField<string>;
  primaryColor: SettingField<string>;
  secondaryColor: SettingField<string>;
  tertiaryColor: SettingField<string>;
  sidebarColorSource: SettingField<'primary' | 'secondary' | 'tertiary'>;
  topbarColorSource: SettingField<'primary' | 'secondary' | 'tertiary'>;
  controlsColorSource: SettingField<'primary' | 'secondary' | 'tertiary'>;
  layout: SettingField<string>;
  layoutWidth: SettingField<string>;
  layoutPosition: SettingField<string>;
  topbarColor: SettingField<string>;
  sidebarSize: SettingField<string>;
  sidebarView: SettingField<string>;
  sidebarColor: SettingField<string>;
  sidebarImage: SettingField<string>;
  preloader: SettingField<string>;
  browseControlsLayout: SettingField<'panels' | 'flyout'>;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  mode: { value: 'light', locked: false },
  primaryColor: { value: DEFAULT_THEME_COLORS.primaryColor, locked: false },
  secondaryColor: { value: DEFAULT_THEME_COLORS.secondaryColor, locked: false },
  tertiaryColor: { value: DEFAULT_THEME_COLORS.tertiaryColor, locked: false },
  sidebarColorSource: { value: 'primary', locked: false },
  topbarColorSource: { value: 'primary', locked: false },
  controlsColorSource: { value: 'tertiary', locked: false },
  layout: { value: 'vertical', locked: false },
  layoutWidth: { value: 'fluid', locked: false },
  layoutPosition: { value: 'fixed', locked: false },
  topbarColor: { value: 'light', locked: false },
  sidebarSize: { value: 'lg', locked: false },
  sidebarView: { value: 'default', locked: false },
  sidebarColor: { value: 'dark', locked: false },
  sidebarImage: { value: 'none', locked: false },
  preloader: { value: 'disable', locked: false },
  browseControlsLayout: { value: 'panels', locked: false },
};

@Component({
  selector: 'app-appearance-settings-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, BaseCoreAgPipesModule,
    SettingsPageShellComponent, SettingsLockComponent,
    ResponsiveEditorHostComponent, ResponsiveEditorContentDirective,
    ColorTierEditorComponent
  ],
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class AppearanceSettingsPanelComponent implements OnInit {
  level: SettingsLevel = 'user';
  settings: AppearanceSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  
  hasUnsavedChanges = false;
  isSaving = false;
  showSuccess = false;

  sidebarImagesPath = themesT1Constants.assets.images.backgrounds.sidebars;
  colorPresets: { name: string; value: string }[] = [];
  
  // Color editor state
  isColorEditorOpen = false;
  editingColorTier: ColorTier = 'primary';
  editingColor = '';
  
  colorSourceOptions = [
    { value: 'primary', labelKey: 'BASE.APPEARANCE.COLORS.PRIMARY' },
    { value: 'secondary', labelKey: 'BASE.APPEARANCE.COLORS.SECONDARY' },
    { value: 'tertiary', labelKey: 'BASE.APPEARANCE.COLORS.TERTIARY' }
  ];

  modeOptions = [
    { value: 'light', labelKey: 'BASE.APPEARANCE.MODE.LIGHT', icon: 'bx-sun' },
    { value: 'dark', labelKey: 'BASE.APPEARANCE.MODE.DARK', icon: 'bx-moon' }
  ];

  layoutWidthOptions = [
    { value: 'fluid', labelKey: 'BASE.APPEARANCE.WIDTH.FLUID' },
    { value: 'boxed', labelKey: 'BASE.APPEARANCE.WIDTH.BOXED' }
  ];

  layoutPositionOptions = [
    { value: 'fixed', labelKey: 'BASE.APPEARANCE.POSITION.FIXED' },
    { value: 'scrollable', labelKey: 'BASE.APPEARANCE.POSITION.SCROLLABLE' }
  ];

  topbarColorOptions = [
    { value: 'light', labelKey: 'BASE.APPEARANCE.COLOR.LIGHT' },
    { value: 'dark', labelKey: 'BASE.APPEARANCE.COLOR.DARK' }
  ];

  sidebarSizeOptions = [
    { value: 'lg', labelKey: 'BASE.APPEARANCE.SIDEBAR_SIZE.DEFAULT' },
    { value: 'md', labelKey: 'BASE.APPEARANCE.SIDEBAR_SIZE.COMPACT' },
    { value: 'sm', labelKey: 'BASE.APPEARANCE.SIDEBAR_SIZE.SMALL_ICON' },
    { value: 'sm-hover', labelKey: 'BASE.APPEARANCE.SIDEBAR_SIZE.SMALL_HOVER' }
  ];

  sidebarColorOptions = [
    { value: 'light', labelKey: 'BASE.APPEARANCE.COLOR.LIGHT', cssClass: 'bg-white border' },
    { value: 'dark', labelKey: 'BASE.APPEARANCE.COLOR.DARK', cssClass: 'bg-primary' },
    { value: 'gradient', labelKey: 'BASE.APPEARANCE.SIDEBAR_COLOR.GRADIENT', cssClass: 'bg-vertical-gradient' },
    { value: 'gradient-2', labelKey: 'BASE.APPEARANCE.SIDEBAR_COLOR.GRADIENT_2', cssClass: 'bg-vertical-gradient-2' },
    { value: 'gradient-3', labelKey: 'BASE.APPEARANCE.SIDEBAR_COLOR.GRADIENT_3', cssClass: 'bg-vertical-gradient-3' },
    { value: 'gradient-4', labelKey: 'BASE.APPEARANCE.SIDEBAR_COLOR.GRADIENT_4', cssClass: 'bg-vertical-gradient-4' }
  ];

  sidebarImageOptions = [
    { value: 'none', labelKey: 'BASE.APPEARANCE.SIDEBAR_IMAGE.NONE', image: null, icon: 'bx-x' },
    { value: 'img-1', labelKey: 'BASE.APPEARANCE.SIDEBAR_IMAGE.IMG_1', image: 'img-1.jpg' },
    { value: 'img-2', labelKey: 'BASE.APPEARANCE.SIDEBAR_IMAGE.IMG_2', image: 'img-2.jpg' },
    { value: 'img-3', labelKey: 'BASE.APPEARANCE.SIDEBAR_IMAGE.IMG_3', image: 'img-3.jpg' },
    { value: 'img-4', labelKey: 'BASE.APPEARANCE.SIDEBAR_IMAGE.IMG_4', image: 'img-4.jpg' }
  ];

  browseControlsOptions = [
    { value: 'panels', labelKey: 'BASE.APPEARANCE.BROWSE.PANELS', icon: 'bx-list-ul' },
    { value: 'flyout', labelKey: 'BASE.APPEARANCE.BROWSE.FLYOUT', icon: 'bx-sidebar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private themeColorService: ThemeColorService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.colorPresets = this.themeColorService.colorPresets;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['level']) {
        this.level = data['level'];
      }
    });
    this.loadSettings();
  }

  get backRoute(): string {
    return `/system/settings/${this.level}`;
  }

  get canLock(): boolean {
    return this.level === 'service' || this.level === 'account';
  }

  get colorEditorTitle(): string {
    switch (this.editingColorTier) {
      case 'primary': return 'Edit Primary Color';
      case 'secondary': return 'Edit Secondary Color';
      case 'tertiary': return 'Edit Tertiary Color';
    }
  }

  isEditable(field: { locked: boolean }): boolean {
    if (this.level === 'service') return true;
    return !field.locked;
  }

  getLockedBy(): 'service' | 'account' {
    return 'service';
  }

  getContrastColor(hex: string): string {
    return this.themeColorService.getContrastColor(hex);
  }

  // --- Color Editor Methods ---
  
  openColorEditor(tier: ColorTier): void {
    this.editingColorTier = tier;
    this.editingColor = this.getColorForTier(tier);
    this.isColorEditorOpen = true;
  }

  onColorEditorClosed(): void {
    this.isColorEditorOpen = false;
  }

  onColorEditorSaved(): void {
    this.setColorForTier(this.editingColorTier, this.editingColor);
    this.onColorChange();
    this.isColorEditorOpen = false;
  }

  onEditingColorChange(color: string): void {
    this.editingColor = color;
    // Live preview while editing
    this.setColorForTier(this.editingColorTier, color);
    this.applyColors();
  }

  private getColorForTier(tier: ColorTier): string {
    switch (tier) {
      case 'primary': return this.settings.primaryColor.value;
      case 'secondary': return this.settings.secondaryColor.value;
      case 'tertiary': return this.settings.tertiaryColor.value;
    }
  }

  private setColorForTier(tier: ColorTier, color: string): void {
    switch (tier) {
      case 'primary': this.settings.primaryColor.value = color; break;
      case 'secondary': this.settings.secondaryColor.value = color; break;
      case 'tertiary': this.settings.tertiaryColor.value = color; break;
    }
  }
  
  onColorChange(): void {
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
    this.applyColors();
  }
  
  private applyColors(): void {
    const config: ThemeColorConfig = {
      primaryColor: this.settings.primaryColor.value,
      secondaryColor: this.settings.secondaryColor.value,
      tertiaryColor: this.settings.tertiaryColor.value,
      sidebarColorSource: this.settings.sidebarColorSource.value,
      topbarColorSource: this.settings.topbarColorSource.value,
      controlsColorSource: this.settings.controlsColorSource.value,
    };
    this.themeColorService.applyThemeColors(config);
  }

  // --- Layout Methods ---
  
  changeLayout(layout: string): void {
    if (!this.isEditable(this.settings.layout)) return;
    this.settings.layout.value = layout;
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
    
    this.store.dispatch(changelayout({ layout }));
    this.store.select(getLayoutTheme).subscribe((layoutValue) => {
      this.document.documentElement.setAttribute('data-layout', layoutValue);
    });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }

  changeSidebarSizeValue(sidebarSize: string): void {
    if (!this.isEditable(this.settings.sidebarSize)) return;
    this.settings.sidebarSize.value = sidebarSize;
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
    
    this.store.dispatch(changeSidebarSize({ sidebarSize }));
    this.store.select(getSidebarSize).subscribe((size) => {
      this.document.documentElement.setAttribute('data-sidebar-size', size);
    });
  }

  changeSidebarViewValue(sidebarView: string): void {
    if (!this.isEditable(this.settings.sidebarView)) return;
    this.settings.sidebarView.value = sidebarView;
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
    
    this.store.dispatch(changeSidebarView({ sidebarView }));
    this.store.select(getSidebarView).subscribe((view) => {
      this.document.documentElement.setAttribute('data-layout-style', view);
    });
  }

  private loadSettings(): void {
    const stored = localStorage.getItem(`appearance.settings.${this.level}`);
    if (stored) {
      try {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      }
    }
    this.applyAllSettings();
  }

  onSettingChange(settingKey: string): void {
    this.hasUnsavedChanges = true;
    this.showSuccess = false;
    this.applySetting(settingKey);
  }

  private applySetting(key: string): void {
    const value = (this.settings as any)[key]?.value;
    if (value === undefined) return;

    switch (key) {
      case 'mode':
        this.store.dispatch(changeMode({ mode: value }));
        this.store.select(getLayoutMode).subscribe((mode) => {
          this.document.documentElement.setAttribute('data-bs-theme', mode);
        });
        break;
      case 'primaryColor':
      case 'secondaryColor':
      case 'tertiaryColor':
      case 'sidebarColorSource':
      case 'topbarColorSource':
      case 'controlsColorSource':
        this.applyColors();
        break;
      case 'layout':
        this.store.dispatch(changelayout({ layout: value }));
        this.store.select(getLayoutTheme).subscribe((layout) => {
          this.document.documentElement.setAttribute('data-layout', layout);
        });
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        break;
      case 'layoutWidth':
        this.store.dispatch(changeLayoutWidth({ layoutWidth: value }));
        this.store.select(getLayoutWith).subscribe((width) => {
          this.document.documentElement.setAttribute('data-layout-width', width);
        });
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        break;
      case 'layoutPosition':
        this.store.dispatch(changeLayoutPosition({ layoutPosition: value }));
        this.store.select(getLayoutPosition).subscribe((position) => {
          this.document.documentElement.setAttribute('data-layout-position', position);
        });
        break;
      case 'topbarColor':
        this.store.dispatch(changeTopbar({ topbarColor: value }));
        this.store.select(getTopbarColor).subscribe((color) => {
          this.document.documentElement.setAttribute('data-topbar', color);
        });
        break;
      case 'sidebarSize':
        this.store.dispatch(changeSidebarSize({ sidebarSize: value }));
        this.store.select(getSidebarSize).subscribe((size) => {
          this.document.documentElement.setAttribute('data-sidebar-size', size);
        });
        break;
      case 'sidebarView':
        this.store.dispatch(changeSidebarView({ sidebarView: value }));
        this.store.select(getSidebarView).subscribe((view) => {
          this.document.documentElement.setAttribute('data-layout-style', view);
        });
        break;
      case 'sidebarColor':
        this.store.dispatch(changeSidebarColor({ sidebarColor: value }));
        this.store.select(getSidebarColor).subscribe((color) => {
          this.document.documentElement.setAttribute('data-sidebar', color);
        });
        break;
      case 'sidebarImage':
        this.store.dispatch(changeSidebarImage({ sidebarImage: value }));
        this.store.select(getSidebarImage).subscribe((image) => {
          this.document.documentElement.setAttribute('data-sidebar-image', image);
        });
        break;
      case 'preloader':
        this.store.dispatch(changeDataPreloader({ Preloader: value }));
        this.store.select(getPreloader).subscribe((loader) => {
          this.document.documentElement.setAttribute('data-preloader', loader);
        });
        break;
    }
  }

  private applyAllSettings(): void {
    Object.keys(this.settings).forEach(key => this.applySetting(key));
  }

  onSave(): void {
    this.isSaving = true;
    setTimeout(() => {
      localStorage.setItem(`appearance.settings.${this.level}`, JSON.stringify(this.settings));
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
    this.applyAllSettings();
  }
}
