import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Products Applet Module
 * 
 * Bounded domain context for e-commerce products.
 * Contains:
 * - Product (sellable items)
 * - ProductType (product categories)
 * 
 * Used by:
 * - sites.app (product management)
 * - sites.anon (product catalog/shop)
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class ProductsAppletModule { }
