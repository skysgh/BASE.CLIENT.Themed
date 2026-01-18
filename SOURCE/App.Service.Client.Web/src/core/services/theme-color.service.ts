/**
 * Theme Color Service
 * 
 * Handles runtime CSS custom property updates for theme colors.
 * 
 * COLOR HIERARCHY:
 * - Primary Color   → Brand identity (default for sidebar, topbar chrome)
 * - Secondary Color → Accents, gradients, highlights
 * - Tertiary Color  → Controls (buttons, links, interactive elements)
 */
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ColorTier {
  hex: string;
  rgb: string;
  textEmphasis: string;
  bgSubtle: string;
  borderSubtle: string;
}

export interface ThemeColorConfig {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  sidebarColorSource: 'primary' | 'secondary' | 'tertiary';
  topbarColorSource: 'primary' | 'secondary' | 'tertiary';
  controlsColorSource: 'primary' | 'secondary' | 'tertiary';
}

export const DEFAULT_THEME_COLORS: ThemeColorConfig = {
  primaryColor: '#405189',
  secondaryColor: '#3577f1',
  tertiaryColor: '#0ab39c',
  sidebarColorSource: 'primary',
  topbarColorSource: 'secondary',
  controlsColorSource: 'tertiary',
};

@Injectable({
  providedIn: 'root'
})
export class ThemeColorService {
  
  readonly colorPresets = [
    // Original theme defaults (restrained/civilised)
    { name: 'Off White', value: '#f3f3f9' },      // Original topbar background
    { name: 'Light Grey', value: '#f6f8fa' },     // Original sidebar light
    { name: 'White', value: '#ffffff' },
    { name: 'Slate Grey', value: '#495057' },
    // Brand colors
    { name: 'Royal Blue', value: '#405189' },
    { name: 'Ocean Blue', value: '#3577f1' },
    { name: 'Forest Green', value: '#0ab39c' },
    { name: 'Sunset Orange', value: '#f7b84b' },
    { name: 'Ruby Red', value: '#f06548' },
    { name: 'Purple', value: '#6559cc' },
    { name: 'Teal', value: '#02a8b5' },
    { name: 'Navy', value: '#1e3a5f' },
  ];

  private currentConfig: ThemeColorConfig = { ...DEFAULT_THEME_COLORS };

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Apply the full theme color configuration
   */
  applyThemeColors(config: Partial<ThemeColorConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...config };
    
    const primary = this.generateColorTier(this.currentConfig.primaryColor);
    const secondary = this.generateColorTier(this.currentConfig.secondaryColor);
    const tertiary = this.generateColorTier(this.currentConfig.tertiaryColor);
    
    // Apply custom theme variables
    this.applyColorTierVariables('brand', primary);
    this.applyColorTierVariables('accent', secondary);
    this.applyColorTierVariables('control', tertiary);
    
    // Apply controls color to --vz-primary (buttons, links)
    const controlsTier = this.getTierBySource(this.currentConfig.controlsColorSource, primary, secondary, tertiary);
    this.applyPrimaryCssVariables(controlsTier);
    
    // Apply sidebar brand color
    const sidebarTier = this.getTierBySource(this.currentConfig.sidebarColorSource, primary, secondary, tertiary);
    this.applySidebarBrandColor(sidebarTier);
    
    // Apply topbar brand color  
    const topbarTier = this.getTierBySource(this.currentConfig.topbarColorSource, primary, secondary, tertiary);
    this.applyTopbarBrandColor(topbarTier);
  }
  
  applyPrimaryColor(hexColor: string): void {
    this.applyThemeColors({ primaryColor: hexColor });
  }
  
  getCurrentConfig(): ThemeColorConfig {
    return { ...this.currentConfig };
  }

  resetToDefault(): void {
    this.applyThemeColors(DEFAULT_THEME_COLORS);
  }

  generateColorTier(hexColor: string): ColorTier {
    if (!this.isValidHex(hexColor)) {
      hexColor = DEFAULT_THEME_COLORS.primaryColor;
    }
    
    const rgb = this.hexToRgb(hexColor);
    
    return {
      hex: hexColor,
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      textEmphasis: this.shadeColor(hexColor, -15),
      bgSubtle: this.tintColor(hexColor, 85),
      borderSubtle: this.tintColor(hexColor, 60),
    };
  }

  private applyColorTierVariables(prefix: string, tier: ColorTier): void {
    const root = this.document.documentElement;
    
    root.style.setProperty(`--theme-${prefix}`, tier.hex);
    root.style.setProperty(`--theme-${prefix}-rgb`, tier.rgb);
    root.style.setProperty(`--theme-${prefix}-text-emphasis`, tier.textEmphasis);
    root.style.setProperty(`--theme-${prefix}-bg-subtle`, tier.bgSubtle);
    root.style.setProperty(`--theme-${prefix}-border-subtle`, tier.borderSubtle);
  }
  
  /**
   * Apply controls color to Bootstrap/Velzon primary variables
   */
  private applyPrimaryCssVariables(tier: ColorTier): void {
    const root = this.document.documentElement;
    
    root.style.setProperty('--vz-primary', tier.hex);
    root.style.setProperty('--vz-primary-rgb', tier.rgb);
    root.style.setProperty('--vz-primary-text-emphasis', tier.textEmphasis);
    root.style.setProperty('--vz-primary-bg-subtle', tier.bgSubtle);
    root.style.setProperty('--vz-primary-border-subtle', tier.borderSubtle);
    root.style.setProperty('--vz-link-color', tier.hex);
    root.style.setProperty('--vz-link-color-rgb', tier.rgb);
  }
  
  /**
   * Apply brand color to sidebar - updates Velzon's sidebar CSS variables
   * This allows custom colors without relying solely on data-sidebar attribute
   */
  private applySidebarBrandColor(tier: ColorTier): void {
    const root = this.document.documentElement;
    const contrastColor = this.getContrastColor(tier.hex);
    const isLight = contrastColor === '#000000';
    
    // Set custom sidebar variables
    root.style.setProperty('--theme-sidebar-brand', tier.hex);
    root.style.setProperty('--theme-sidebar-brand-rgb', tier.rgb);
    
    // Also update Velzon's dark sidebar variables for immediate effect
    // These apply when data-sidebar="dark" is set
    root.style.setProperty('--vz-vertical-menu-bg', tier.hex);
    root.style.setProperty('--vz-vertical-menu-border', tier.hex);
    
    // Update text colors based on background brightness
    if (!isLight) {
      // Dark background - use light text
      root.style.setProperty('--vz-vertical-menu-item-color', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--vz-vertical-menu-item-hover-color', '#ffffff');
      root.style.setProperty('--vz-vertical-menu-item-active-color', '#ffffff');
      root.style.setProperty('--vz-vertical-menu-sub-item-color', 'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--vz-vertical-menu-sub-item-hover-color', '#ffffff');
      root.style.setProperty('--vz-vertical-menu-title-color', 'rgba(255, 255, 255, 0.5)');
    } else {
      // Light background - use dark text
      root.style.setProperty('--vz-vertical-menu-item-color', 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--vz-vertical-menu-item-hover-color', tier.hex);
      root.style.setProperty('--vz-vertical-menu-item-active-color', tier.hex);
      root.style.setProperty('--vz-vertical-menu-sub-item-color', 'rgba(0, 0, 0, 0.6)');
      root.style.setProperty('--vz-vertical-menu-sub-item-hover-color', tier.hex);
      root.style.setProperty('--vz-vertical-menu-title-color', 'rgba(0, 0, 0, 0.5)');
    }
    
    // Set data-sidebar to dark to trigger the dark sidebar styles
    root.setAttribute('data-sidebar', 'dark');
  }
  
  /**
   * Apply brand color to topbar
   */
  private applyTopbarBrandColor(tier: ColorTier): void {
    const root = this.document.documentElement;
    const contrastColor = this.getContrastColor(tier.hex);
    const isLight = contrastColor === '#000000';
    
    root.style.setProperty('--theme-topbar-brand', tier.hex);
    root.style.setProperty('--theme-topbar-brand-rgb', tier.rgb);
    
    // Update topbar variables for dark topbar
    root.style.setProperty('--vz-header-bg', tier.hex);
    root.style.setProperty('--vz-header-border', tier.hex);
    
    if (!isLight) {
      root.style.setProperty('--vz-header-item-color', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--vz-header-item-sub-color', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--vz-topbar-search-bg', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--vz-topbar-search-color', '#ffffff');
      root.style.setProperty('--vz-topbar-user-bg', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--vz-header-item-color', 'rgba(0, 0, 0, 0.85)');
      root.style.setProperty('--vz-header-item-sub-color', 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--vz-topbar-search-bg', 'rgba(0, 0, 0, 0.05)');
      root.style.setProperty('--vz-topbar-search-color', '#000000');
      root.style.setProperty('--vz-topbar-user-bg', 'rgba(0, 0, 0, 0.05)');
    }
    
    // Set data-topbar to dark to trigger dark topbar styles
    root.setAttribute('data-topbar', 'dark');
  }
  
  private getTierBySource(
    source: 'primary' | 'secondary' | 'tertiary',
    primary: ColorTier, secondary: ColorTier, tertiary: ColorTier
  ): ColorTier {
    switch (source) {
      case 'primary': return primary;
      case 'secondary': return secondary;
      case 'tertiary': return tertiary;
    }
  }

  isValidHex(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  shadeColor(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    const factor = 1 + (percent / 100);
    return this.rgbToHex(
      rgb.r * factor,
      rgb.g * factor,
      rgb.b * factor
    );
  }

  tintColor(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    const factor = percent / 100;
    return this.rgbToHex(
      rgb.r + (255 - rgb.r) * factor,
      rgb.g + (255 - rgb.g) * factor,
      rgb.b + (255 - rgb.b) * factor
    );
  }

  getContrastColor(hex: string): string {
    if (!this.isValidHex(hex)) return '#000000';
    const rgb = this.hexToRgb(hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
}
