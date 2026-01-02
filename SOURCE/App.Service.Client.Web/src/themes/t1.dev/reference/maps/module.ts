/**
 * Maps Reference Module
 * 
 * Near-direct copy from Velzon theme: pages/maps
 * Provides map library reference pages for developers.
 * 
 * Source: Velzon (Minimal) - maps module
 * 
 * Note: Using @asymmetrik/ngx-leaflet (same as @bluehalo/ngx-leaflet, just renamed)
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Google Map
import { GoogleMapsModule } from '@angular/google-maps';
// Leaflet Map - Using @asymmetrik/ngx-leaflet (installed in this project)
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Compatibility shim for breadcrumbs
import { DevBreadcrumbsComponent } from '../../ui/widgets/breadcrumbs/component';

// Routing
import { MapsReferenceRoutingModule } from './routing';

// Component pages
import { GoogleComponent } from './google/google.component';
import { LeafletComponent } from './leaflet/leaflet.component';

@NgModule({
  declarations: [
    GoogleComponent,
    LeafletComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    LeafletModule,
    MapsReferenceRoutingModule,
    DevBreadcrumbsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapsReferenceModule { }
