import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Theme Module
 * 
 * Theme reference and documentation applet.
 * 
 * PURPOSE:
 * - Reference for theme components, icons, colors, typography
 * - Style guide for consistent UI development
 * - Copy-paste examples for applet developers
 * 
 * NOT FOR:
 * - Actual theme implementation (that's in themes/t1/)
 * - Runtime theme switching (that's in core services)
 * 
 * ROUTES:
 * - /system/theme/ - Theme reference hub
 * - /system/theme/colors - Color palette
 * - /system/theme/icons - Icon reference
 * - /system/theme/typography - Font styles
 * - /system/theme/components - Component gallery
 * - /system/theme/forms - Form field examples
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => 
          import('./views/theme-hub/component').then(m => m.ThemeHubComponent)
      },
      {
        path: 'colors',
        loadComponent: () => 
          import('./views/colors-reference/component').then(m => m.ColorsReferenceComponent)
      },
      {
        path: 'icons',
        loadComponent: () => 
          import('./views/icons-reference/component').then(m => m.IconsReferenceComponent)
      },
      {
        path: 'typography',
        loadComponent: () => 
          import('./views/typography-reference/component').then(m => m.TypographyReferenceComponent)
      },
      {
        path: 'components',
        loadComponent: () => 
          import('./views/components-reference/component').then(m => m.ComponentsReferenceComponent)
      },
      {
        path: 'forms',
        loadComponent: () => 
          import('./views/forms-reference/component').then(m => m.FormsReferenceComponent)
      },
    ])
  ],
  exports: [RouterModule]
})
export class ThemeModule {}
