/**
 * i18n Module
 * 
 * Language and localization management.
 * 
 * Routes:
 * - /system/i18n - Language management hub
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => 
          import('./ui/views/language-hub/component').then(m => m.LanguageHubComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class I18nModule { }
