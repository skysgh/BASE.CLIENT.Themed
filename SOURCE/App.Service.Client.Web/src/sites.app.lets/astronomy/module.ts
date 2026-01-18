/**
 * Astronomy Applet Module
 * 
 * Showcase applet demonstrating all relationship types:
 * - 1-* : StarSystem → Stars, Planet → Moons
 * - *-* : Star ↔ Constellation (via junction)
 * - *-1 : Planet → Star (orbits)
 * - 1-1 : Planet → Atmosphere
 * 
 * This is NOT a commercial product - purely for framework demonstration.
 * Using celestial bodies ensures it won't conflict with real business domains.
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

// Local components (will be created)
import { AstronomyHubComponent } from './ui/views/astronomy-hub/component';
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
    StarSystemBrowseComponent,
    StarSystemReadComponent,
    PlanetBrowseComponent,
    PlanetReadComponent,
    // Routing
    RouterModule.forChild([
      // Hub - landing page
      { path: '', component: AstronomyHubComponent },
      
      // Star Systems (aggregate root)
      { path: 'star-systems', component: StarSystemBrowseComponent },
      { path: 'star-systems/:id', component: StarSystemReadComponent },
      
      // Planets (can browse all or within a star system)
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
