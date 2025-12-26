//ngx:
import { RouterModule } from '@angular/router';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ✅ NEW: Config Registry
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Import Common dependencies:

// Import Module specific dependencies:
//import { SpikeRoutingModule } from "./routing.module";
// .. services:
import { BaseAppsSpikeSpikesRepositoryService } from "./services/repositories/spike-repository.service"
// ..components:
import { BaseAppsSpikeRouteOutletComponent } from './ui/_route/component';
import { BaseAppsSpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
import { BaseAppsSpikeSpikesReadComponent } from './modules/spike/ui/read/component';
import { BaseAppsSpikeSpikesEditComponent } from './modules/spike/ui/edit/component';
// 
import { BaseAppsSpikeSubSpikesBrowseComponent } from './modules/subSpike/ui/browse/component';
import { BaseAppsSpikeSubSpikesRepositoryService } from './services/repositories/subspike-repository.service';

// ✅ NEW: Import spike constants
import { appletsSpikesConstants } from './constants/implementations/app.lets.spikes.constants';

//import { BaseThemesV1CommonModule } from '../../themes/v0/features/components/module';

// import { BaseCoreCommonComponentsModule } from '../../../core/modules/common/components/module';
import { ServiceLanguagesRepositoryService } from '../../core/services/services/repositories/service-languages.repository.service';
import { ServiceLanguagesService } from '../../core/services/service.languages.service';
import { BaseAppsModule } from '../sites.app/module';

// ...submodules:
// NO mention, as it is late loaded by routes:
// import { SpikeSpikesModule } from "./modules/spike/module";




@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseAppsSpikeRouteOutletComponent,
    // Spike Components:
    BaseAppsSpikeSpikesBrowseComponent,
    BaseAppsSpikeSpikesReadComponent,
    BaseAppsSpikeSpikesEditComponent,
    // SubSpike Components:
    BaseAppsSpikeSubSpikesBrowseComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    BaseAppsSpikeSpikesRepositoryService,
    BaseAppsSpikeSubSpikesRepositoryService,
    ServiceLanguagesService,
    ServiceLanguagesRepositoryService
  ],
  imports: [
    CommonModule,

    //Can Remove: TranslateModule.forChild(),
    RouterModule.forChild(
      [
      // we're basically saying load a control from this module,
      // which happens to be a router-output, and into that
      // load the module for specific group of views:
      //{
      //  //path: 'spike', component: SpikeRouteOutletComponent,
        ////loadChildren: () => import('./modules/spike/module').then(m => m.SpikeSpikesModule), /*canActivate: [AuthGuard]*/
        //children:
        //  [
            { path: 'spikes', component: BaseAppsSpikeSpikesBrowseComponent },
            { path: 'browse', redirectTo: 'spikes', pathMatch: 'prefix' },
            { path: 'list', redirectTo: 'spikes', pathMatch: 'prefix' },
            { path: ':id', component: BaseAppsSpikeSpikesReadComponent },
            { path: 'view/:id', redirectTo: ':id', pathMatch: 'prefix' },
            //    { path: 'read/:id', redirectTo: ':id', pathMatch: 'prefix' },
            { path: 'edit/:id', component: BaseAppsSpikeSpikesEditComponent },
            { path: '', redirectTo:'spikes', pathMatch:'prefix'}
    //      ]
    //  },
    //  // Until there are other entities:
    //  { path: '', redirectTo: 'spike', pathMatch: 'prefix' },
      ]
    ),
    // Import classes within the above specified import files.
    //Ag specific:
    FormsModule,

    // Routes:
    // BaseAppsSpikeRoutingModule,

    // Import Parent Module:
    BaseAppsModule
  ],
  exports: [
    // Not sure why doing this:
    RouterModule
    // NO: Export Parent Module:
    // NO: BaseAppsModule,
    ]
})
export class BaseAppsSpikeModule {
  /**
   * ✅ NEW: Register Spike applet
   * 
   * Uses namespaced key: 'applets.spike' (not just 'spike')
   * This prevents collision with core tiers.
   */
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.spike', {
      constants: appletsSpikesConstants
    });
  }
}
