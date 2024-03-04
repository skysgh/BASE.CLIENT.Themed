import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Import Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Common dependencies:

// Import Module specific dependencies:
//import { SpikeRoutingModule } from "./routing.module";
// .. services:
import { BaseAppsSpikeSpikesRepositoryService } from "./services/spike-repository.service"
// ..components:
import { BaseAppsSpikeRouteOutletComponent } from './ui/_route/component';
import { BaseAppsSpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
import { BaseAppsSpikeSpikesReadComponent } from './modules/spike/ui/read/component';
import { BaseAppsSpikeSpikesEditComponent } from './modules/spike/ui/edit/component';
//
import { BaseAppsSpikeSubSpikesBrowseComponent } from './modules/subSpike/ui/browse/component';
import { BaseAppsSpikeSubSpikesRepositoryService } from './services/subspike-repository.service';

// ...submodules:
// NO mention, as it is late loaded by routes:
// import { SpikeSpikesModule } from "./modules/spike/module";




@NgModule({
  imports: [
    TranslateModule,
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
    CommonModule,
    FormsModule,
    // Module specific:
    //SpikeRoutingModule,
  ],
  exports: [
    // Not sure why doing this:
    RouterModule
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
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
    BaseAppsSpikeSubSpikesRepositoryService
  ]
})
export class BaseAppsSpikeModule { }
