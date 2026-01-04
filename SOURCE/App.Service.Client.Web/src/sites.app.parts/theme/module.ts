import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Theme Module
 * 
 * Theme customization and reference applet.
 * 
 * PURPOSE:
 * - User theme settings (color palette, mode, layout)
 * - Reference for theme components, icons, colors, typography
 * - Style guide for consistent UI development
 * - Copy-paste examples for applet developers
 * 
 * ROUTES:
 * - /system/theme/ - Theme reference hub
 * - /system/theme/settings - User theme preferences
 * - /system/theme/colors - Color palette
 * - /system/theme/icons - Icon reference
 * - /system/theme/typography - Font styles
 * - /system/theme/components - Component gallery
 * - /system/theme/forms - Form field examples
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => 
          import('./ui/views/theme-hub/component').then(m => m.ThemeHubComponent)
      },
      {
        path: 'settings',
        loadComponent: () => 
          import('./ui/views/theme-settings/component').then(m => m.ThemeSettingsComponent)
      },
      {
        path: 'colors',
        loadComponent: () => 
          import('./ui/views/colors-reference/component').then(m => m.ColorsReferenceComponent)
      },
      {
        path: 'icons',
        loadComponent: () => 
          import('./ui/views/icons-reference/component').then(m => m.IconsReferenceComponent)
      },
      {
        path: 'typography',
        loadComponent: () => 
          import('./ui/views/typography-reference/component').then(m => m.TypographyReferenceComponent)
      },
      {
        path: 'components',
        loadComponent: () => 
          import('./ui/views/components-reference/component').then(m => m.ComponentsReferenceComponent)
      },
      {
        path: 'forms',
        loadComponent: () => 
          import('./ui/views/forms-reference/component').then(m => m.FormsReferenceComponent)
      },
    ])
  ],
  exports: [RouterModule]
})
export class ThemeModule {}
