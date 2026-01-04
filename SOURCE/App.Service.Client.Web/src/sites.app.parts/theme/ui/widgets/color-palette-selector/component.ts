import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';
import { ThemeColor, ThemePreferences } from '../../../models';

/**
 * Color Palette Selector Widget
 * 
 * Displays a palette of predefined colors for the user to select as the primary theme color.
 * Persists selection to localStorage via ThemeService.
 */
@Component({
  selector: 'app-color-palette-selector',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ColorPaletteSelectorComponent implements OnInit, OnDestroy {
  colors: ThemeColor[] = [];
  selectedColorId: string = 'blue';
  
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.colors = this.themeService.getColorPalette();
    
    this.themeService.getPreferences()
      .pipe(takeUntil(this.destroy$))
      .subscribe((prefs: ThemePreferences) => {
        this.selectedColorId = prefs.primaryColorId;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectColor(color: ThemeColor): void {
    this.themeService.setPrimaryColor(color.id);
  }

  isSelected(color: ThemeColor): boolean {
    return this.selectedColorId === color.id;
  }
}
