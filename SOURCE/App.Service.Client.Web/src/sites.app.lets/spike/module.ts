//ngx:
import { RouterModule } from '@angular/router';

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Formly - use CoreFormlyModule which registers custom types including 'label'
import { CoreFormlyModule } from '../../core/forms/formly.module';

// Core pipes (for baseTranslate)
import { BaseCoreAgPipesModule } from '../../core.ag/pipes/module';

// Core components (for child-summary, drill-selector)
import { CoreComponentsModule } from '../../core/components/module';

// Core.ag components (for browse-view)
import { BrowseViewComponent } from '../../core.ag/components/browse-view';

// Core utilities only (not domain-specific)
import { ConfigRegistryService } from '../../core/services/config-registry.service';
import { CardBrokerRegistry } from '../../core/models/presentation/card-broker.model';

// Local applet services
import { SpikeService } from './services/spike.service';
import { SubSpikeService } from './services/sub-spike.service';

// Local applet brokers
import { SpikeCardBroker } from './brokers/spike-card.broker';

// Import Module specific dependencies:
// .. Spike BREAD components:
import { BaseAppsSpikeRouteOutletComponent } from './ui/_route/component';
import { BaseAppsSpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
import { BaseAppsSpikeSpikesBrowseLegacyComponent } from './modules/spike/ui/browse-legacy/component';
import { BaseAppsSpikeSpikesReadComponent } from './modules/spike/ui/read/component';
import { BaseAppsSpikeSpikesEditComponent } from './modules/spike/ui/edit/component';
import { BaseAppsSpikeSpikesAddComponent } from './modules/spike/ui/add/component';
import { BaseAppsSpikeSubSpikesBrowseComponent } from './modules/subSpike/ui/browse/component';
import { BaseAppsSpikeSubSpikesReadComponent } from './modules/subSpike/ui/read/component';
import { BaseAppsSpikeSubSpikesEditComponent } from './modules/subSpike/ui/edit/component';
import { BaseAppsSpikeSubSpikesAddComponent } from './modules/subSpike/ui/add/component';
import { BaseAppsSpikeInsightsComponent } from './modules/spike/ui/insights/component';
import { SpikeDashboardWidgetComponent } from './ui/widgets/spike-widget/component';

// Applet constants
import { appletsSpikesConstants } from './constants/implementations/app.lets.spikes.constants';


@NgModule({
  declarations: [
    BaseAppsSpikeRouteOutletComponent,
    // Spike BREAD
    BaseAppsSpikeSpikesBrowseComponent,
    BaseAppsSpikeSpikesBrowseLegacyComponent, // ← Legacy browse (parked for reference)
    BaseAppsSpikeSpikesReadComponent,
    BaseAppsSpikeSpikesEditComponent,
    BaseAppsSpikeSpikesAddComponent,
    // SubSpike BREAD
    BaseAppsSpikeSubSpikesBrowseComponent,
    BaseAppsSpikeSubSpikesReadComponent,
    BaseAppsSpikeSubSpikesEditComponent,
    BaseAppsSpikeSubSpikesAddComponent,
    // I-BREAD-T additions:
    BaseAppsSpikeInsightsComponent,
    SpikeDashboardWidgetComponent,
  ],
  providers: [
    // Local applet services
    SpikeService,
    SubSpikeService,
    // Card broker (for Universal Search)
    SpikeCardBroker,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Use CoreFormlyModule instead of FormlyModule.forChild() + FormlyBootstrapModule
    // CoreFormlyModule registers custom types including 'label' for read-only views
    CoreFormlyModule,
    BaseCoreAgPipesModule,
    CoreComponentsModule,
    // BrowseView for universal browse rendering
    BrowseViewComponent,
    RouterModule.forChild([
      // I-BREAD-T routes for Spike
      { path: 'insights', component: BaseAppsSpikeInsightsComponent },
      { path: 'reports', redirectTo: 'insights', pathMatch: 'prefix' },
      { path: 'analytics', redirectTo: 'insights', pathMatch: 'prefix' },
      
      { path: 'spikes', component: BaseAppsSpikeSpikesBrowseComponent },
      { path: 'browse', redirectTo: 'spikes', pathMatch: 'prefix' },
      { path: 'list', redirectTo: 'spikes', pathMatch: 'prefix' },
      
      // Legacy browse (for reference/comparison)
      { path: 'spikes-legacy', component: BaseAppsSpikeSpikesBrowseLegacyComponent },
      
      { path: 'add', component: BaseAppsSpikeSpikesAddComponent },
      { path: 'new', redirectTo: 'add', pathMatch: 'prefix' },
      { path: 'create', redirectTo: 'add', pathMatch: 'prefix' },
      
      { path: 'edit/:id', component: BaseAppsSpikeSpikesEditComponent },
      
      // SubSpike BREAD routes (nested under parent spike)
      { path: ':id/subspikes', component: BaseAppsSpikeSubSpikesBrowseComponent },
      { path: ':id/subspikes/add', component: BaseAppsSpikeSubSpikesAddComponent },
      { path: ':id/subspikes/:subId', component: BaseAppsSpikeSubSpikesReadComponent },
      { path: ':id/subspikes/edit/:subId', component: BaseAppsSpikeSubSpikesEditComponent },
      
      // Spike Read (must be after subspikes routes to avoid conflicts)
      { path: ':id', component: BaseAppsSpikeSpikesReadComponent },
      { path: 'view/:id', redirectTo: ':id', pathMatch: 'prefix' },
      
      { path: '', redirectTo: 'spikes', pathMatch: 'prefix' }
    ])
  ],
  exports: [
    RouterModule,
    // Export widget for use in dashboards
    SpikeDashboardWidgetComponent,
  ]
})
export class BaseAppsSpikeModule {
  constructor(
    configRegistryService: ConfigRegistryService,
    brokerRegistry: CardBrokerRegistry,
    spikeBroker: SpikeCardBroker
  ) {
    // Register applet config
    configRegistryService.register('applets.spike', {
      constants: appletsSpikesConstants
    });
    
    // Register card broker for Universal Search
    brokerRegistry.register(spikeBroker);
  }
}
