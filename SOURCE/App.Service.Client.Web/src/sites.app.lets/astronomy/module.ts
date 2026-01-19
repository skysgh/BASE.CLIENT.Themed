/**
 * Astronomy Applet Module
 * 
 * Showcase applet demonstrating SCHEMA-DRIVEN approach:
 * - All entities use EntityCrudPageComponent
 * - BREAD views generated from EntitySchema
 * - Hub provides navigation tiles
 * 
 * Relationship types demonstrated:
 * - 1-* : StarSystem → Stars, Planet → Moons
 * - *-* : StarSystem ↔ Astronomer (discovery credits)
 * - *-1 : Planet → Star (orbits), Star → Constellation
 * - 1-1 : Planet → Atmosphere
 * 
 * Route: /apps/astronomy
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Core modules
import { BaseCoreAgPipesModule } from '../../core.ag/pipes/module';
import { BaseCoreAgComponentsModule } from '../../core.ag/components.default/module';
import { BrowseViewComponent } from '../../core.ag/ui/widgets/browse-view';
import { CoreFormlyModule } from '../../core/forms/formly.module';

// Settings registry
import { AppletSettingsRegistryService } from '../../sites.app.parts/settings/services/applet-settings-registry.service';

// Local components
import { AstronomyHubComponent } from './ui/views/astronomy-hub/component';
import { AstronomyEntityPageComponent } from './ui/views/astronomy-entity-page/component';

// Legacy custom components (to be deprecated)
import { StarSystemBrowseComponent } from './modules/star-system/ui/views/browse/component';
import { StarSystemReadComponent } from './modules/star-system/ui/views/read/component';
import { PlanetBrowseComponent } from './modules/planet/ui/views/browse/component';
import { PlanetReadComponent } from './modules/planet/ui/views/read/component';

// Services
import { AstronomyService } from './services/astronomy.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoreFormlyModule,
    BaseCoreAgPipesModule,
    BaseCoreAgComponentsModule,
    BrowseViewComponent,
    // Standalone components
    AstronomyHubComponent,
    AstronomyEntityPageComponent,
    // Legacy components (keep for now, will be removed)
    StarSystemBrowseComponent,
    StarSystemReadComponent,
    PlanetBrowseComponent,
    PlanetReadComponent,
    // Routing
    RouterModule.forChild([
      // Hub - landing page
      { path: '', component: AstronomyHubComponent },
      
      // ================================================================
      // SCHEMA-DRIVEN ROUTES (NEW - using EntityCrudPageComponent)
      // ================================================================
      
      // Star Systems - schema-driven BREAD
      { 
        path: 'star-systems-v2', 
        component: AstronomyEntityPageComponent,
        data: { entityType: 'starSystem' }
      },
      
      // Planets - schema-driven BREAD
      { 
        path: 'planets-v2', 
        component: AstronomyEntityPageComponent,
        data: { entityType: 'planet' }
      },
      
      // Astronomers - schema-driven BREAD
      { 
        path: 'astronomers', 
        component: AstronomyEntityPageComponent,
        data: { entityType: 'astronomer' }
      },
      
      // ================================================================
      // LEGACY ROUTES (custom components - to be deprecated)
      // ================================================================
      
      // Star Systems (custom components)
      { path: 'star-systems', component: StarSystemBrowseComponent },
      { path: 'star-systems/:id', component: StarSystemReadComponent },
      
      // Planets (custom components)
      { path: 'planets', component: PlanetBrowseComponent },
      { path: 'planets/:id', component: PlanetReadComponent },
      { path: 'star-systems/:systemId/planets', component: PlanetBrowseComponent },
      { path: 'star-systems/:systemId/planets/:id', component: PlanetReadComponent },
    ])
  ],
  providers: [
    AstronomyService
  ],
  exports: [RouterModule]
})
export class AstronomyModule {
  constructor(
    settingsRegistry: AppletSettingsRegistryService
  ) {
    // Register applet in settings (even if minimal settings)
    settingsRegistry.register({
      appletId: 'astronomy',
      displayNameKey: 'APPS.ASTRONOMY.SINGULAR',
      icon: 'bx-planet',
      searchHintKeys: ['astronomy, stars, planets, space, celestial'],
      category: 'app',
      order: 20,
      sections: []
    });
  }
}
