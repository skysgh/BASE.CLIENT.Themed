//ngx:
import { RouterModule } from '@angular/router';

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Core utilities only (not domain-specific)
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// ✅ FIXED: Use LOCAL applet services (not core - those were moved here)
import { SpikeService } from './services/spike.service';
import { SubSpikeService } from './services/sub-spike.service';

// Import Module specific dependencies:
// .. components:
import { BaseAppsSpikeRouteOutletComponent } from './ui/_route/component';
import { BaseAppsSpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
import { BaseAppsSpikeSpikesReadComponent } from './modules/spike/ui/read/component';
import { BaseAppsSpikeSpikesEditComponent } from './modules/spike/ui/edit/component';
import { BaseAppsSpikeSubSpikesBrowseComponent } from './modules/subSpike/ui/browse/component';

// Applet constants
import { appletsSpikesConstants } from './constants/implementations/app.lets.spikes.constants';


@NgModule({
  declarations: [
    BaseAppsSpikeRouteOutletComponent,
    BaseAppsSpikeSpikesBrowseComponent,
    BaseAppsSpikeSpikesReadComponent,
    BaseAppsSpikeSpikesEditComponent,
    BaseAppsSpikeSubSpikesBrowseComponent
  ],
  providers: [
    // Local applet services
    SpikeService,
    SubSpikeService
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'spikes', component: BaseAppsSpikeSpikesBrowseComponent },
      { path: 'browse', redirectTo: 'spikes', pathMatch: 'prefix' },
      { path: 'list', redirectTo: 'spikes', pathMatch: 'prefix' },
      { path: ':id', component: BaseAppsSpikeSpikesReadComponent },
      { path: 'view/:id', redirectTo: ':id', pathMatch: 'prefix' },
      { path: 'edit/:id', component: BaseAppsSpikeSpikesEditComponent },
      { path: '', redirectTo: 'spikes', pathMatch: 'prefix' }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class BaseAppsSpikeModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.spike', {
      constants: appletsSpikesConstants
    });
  }
}
