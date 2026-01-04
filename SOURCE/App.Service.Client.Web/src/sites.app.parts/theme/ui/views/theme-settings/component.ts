import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';
import { 
  ThemePreferences, 
  ThemeMode, 
  SidebarColor, 
  TopbarColor, 
  LayoutType, 
  SidebarSize 
} from '../../../models';
import { ColorPaletteSelectorComponent } from '../../widgets/color-palette-selector/component';

/**
 * Theme Settings View
 * 
 * Full settings page for theme customization including:
 * - Color palette selection
 * - Light/Dark mode toggle
 * - Layout type selection
 * - Sidebar color and size
 * - Topbar color
 * 
 * This is the user-facing settings view that can be embedded
 * in a settings page or displayed as a standalone route.
 */
@Component({
  selector: 'app-theme-settings',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPaletteSelectorComponent]
})
export class ThemeSettingsComponent implements OnInit, OnDestroy {
  preferences!: ThemePreferences;
  
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.getPreferences()
      .pipe(takeUntil(this.destroy$))
      .subscribe(prefs => {
        this.preferences = prefs;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Mode
  setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }

  // Layout
  setLayout(layout: LayoutType): void {
    this.themeService.setLayout(layout);
  }

  // Sidebar Color
  setSidebarColor(color: SidebarColor): void {
    this.themeService.setSidebarColor(color);
  }

  // Topbar Color
  setTopbarColor(color: TopbarColor): void {
    this.themeService.setTopbarColor(color);
  }

  // Sidebar Size
  setSidebarSize(size: SidebarSize): void {
    this.themeService.setSidebarSize(size);
  }

  // Reset
  resetToDefaults(): void {
    this.themeService.resetToDefaults();
  }
}
