/**
 * Maps Reference Routing
 * 
 * Near-direct copy from Velzon theme: pages/maps/maps-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { GoogleComponent } from "./google/google.component";
import { LeafletComponent } from "./leaflet/leaflet.component";

const routes: Routes = [
  // Default to leaflet (no API key required)
  {
    path: '',
    redirectTo: 'leaflet',
    pathMatch: 'full'
  },
  { path: 'google', component: GoogleComponent },
  { path: 'leaflet', component: LeafletComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsReferenceRoutingModule {}
