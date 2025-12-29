//ngx:
import { RouterModule } from '@angular/router';

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Formly
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

// Core pipes (for baseTranslate)
import { BaseCoreAgPipesModule } from '../../core.ag/pipes/module';

// Core utilities only (not domain-specific)
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Local applet services
import { SpikeService } from './services/spike.service';
import { SubSpikeService } from './services/sub-spike.service';

// Import Module specific dependencies:
// .. BREAD components:
import { BaseAppsSpikeRouteOutletComponent } from './ui/_route/component';
import { BaseAppsSpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
import { BaseAppsSpikeSpikesReadComponent } from './modules/spike/ui/read/component';
import { BaseAppsSpikeSpikesEditComponent } from './modules/spike/ui/edit/component';
import { BaseAppsSpikeSpikesAddComponent } from './modules/spike/ui/add/component';
import { BaseAppsSpikeSubSpikesBrowseComponent } from './modules/subSpike/ui/browse/component';
// .. Insights component (I in I-BREAST-D):
import { BaseAppsSpikeInsightsComponent } from './modules/spike/ui/insights/component';
// .. Dashboard widget (D in I-BREAST-D):
import { SpikeDashboardWidgetComponent } from './widgets/spike-widget/component';

// Applet constants
import { appletsSpikesConstants } from './constants/implementations/app.lets.spikes.constants';


@NgModule({
  declarations: [
    BaseAppsSpikeRouteOutletComponent,
    BaseAppsSpikeSpikesBrowseComponent,
    BaseAppsSpikeSpikesReadComponent,
    BaseAppsSpikeSpikesEditComponent,
    BaseAppsSpikeSpikesAddComponent,
    BaseAppsSpikeSubSpikesBrowseComponent,
    // I-BREAST-D additions:
    BaseAppsSpikeInsightsComponent,
    SpikeDashboardWidgetComponent,
  ],
  providers: [
    // Local applet services
    SpikeService,
    SubSpikeService
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forChild(),
    FormlyBootstrapModule,
    BaseCoreAgPipesModule,
    RouterModule.forChild([
      // I-BREAST-D routes
      { path: 'insights', component: BaseAppsSpikeInsightsComponent },
      { path: 'reports', redirectTo: 'insights', pathMatch: 'prefix' },
      { path: 'analytics', redirectTo: 'insights', pathMatch: 'prefix' },
      
      { path: 'spikes', component: BaseAppsSpikeSpikesBrowseComponent },
      { path: 'browse', redirectTo: 'spikes', pathMatch: 'prefix' },
      { path: 'list', redirectTo: 'spikes', pathMatch: 'prefix' },
      
      { path: 'add', component: BaseAppsSpikeSpikesAddComponent },
      { path: 'new', redirectTo: 'add', pathMatch: 'prefix' },
      { path: 'create', redirectTo: 'add', pathMatch: 'prefix' },
      
      { path: ':id', component: BaseAppsSpikeSpikesReadComponent },
      { path: 'view/:id', redirectTo: ':id', pathMatch: 'prefix' },
      
      { path: 'edit/:id', component: BaseAppsSpikeSpikesEditComponent },
      
      // SubSpikes (recursive BREAD)
      { path: ':id/subspikes', component: BaseAppsSpikeSubSpikesBrowseComponent },
      
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
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.spike', {
      constants: appletsSpikesConstants
    });
  }
}
