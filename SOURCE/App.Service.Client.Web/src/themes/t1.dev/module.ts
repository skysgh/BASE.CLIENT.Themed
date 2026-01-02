/**
 * Theme T1 Developer Reference Module
 * 
 * Developer reference pages for Velzon theme (T1) components.
 * Located in themes/t1.dev to extend themes/t1.
 * 
 * Route Structure:
 * /dev/theme/t1/minimal/icons/*    → Icon libraries
 * /dev/theme/t1/minimal/ui/*       → UI components
 * /dev/theme/t1/minimal/charts/*   → Chart examples
 * /dev/theme/t1/minimal/forms/*    → Form elements
 * /dev/theme/t1/minimal/tables/*   → Table examples
 * /dev/theme/t1/minimal/maps/*     → Map integrations
 * 
 * Note: "minimal" refers to the Velzon theme variant used.
 * Other variants could be: "default", "material", "creative", etc.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { T1DevRoutingModule } from './routing';
import { T1DevHubComponent } from './ui/views/dev-hub/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    T1DevRoutingModule,
    T1DevHubComponent,
  ],
  exports: []
})
export class T1DevModule { }
