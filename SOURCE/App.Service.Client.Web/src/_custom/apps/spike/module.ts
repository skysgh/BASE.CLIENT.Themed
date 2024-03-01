// Import Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Common dependencies:

// Import Module specific dependencies:
//import { SpikeRoutingModule } from "./routing.module";
// .. services:
import { SpikeSpikesRepositoryService } from "./services/spike-repository.service"
// ..components:
import { SpikeRouteOutletComponent } from './ui/_route/component';
import { SpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
import { SpikeSpikesReadComponent } from './modules/spike/ui/read/component';
import { SpikeSpikesEditComponent } from './modules/spike/ui/edit/component';
//
import { SpikesSubSpikeBrowseComponent } from './modules/subSpike/ui/browse/component';
import { SpikeSubSpikesRepositoryService } from './services/subspike-repository.service';
import { RouterModule } from '@angular/router';

// ...submodules:
// NO mention, as it is late loaded by routes:
// import { SpikeSpikesModule } from "./modules/spike/module";




@NgModule({
  imports: [
    RouterModule.forChild(
      [
      // we're basically saying load a control from this module,
      // which happens to be a router-output, and into that
      // load the module for specific group of views:
      {
        path: 'spike', component: SpikeRouteOutletComponent,
        //loadChildren: () => import('./modules/spike/module').then(m => m.SpikeSpikesModule), /*canActivate: [AuthGuard]*/
        children:
          [
            { path: '', component: SpikeSpikesBrowseComponent },
            { path: 'browse', redirectTo: '', pathMatch: 'prefix' },
            { path: 'list', redirectTo: '', pathMatch: 'prefix' },
            { path: ':id', component: SpikeSpikesReadComponent },
            { path: 'view/:id', redirectTo: ':id', pathMatch: 'prefix' },
            //    { path: 'read/:id', redirectTo: ':id', pathMatch: 'prefix' },
            { path: 'edit/:id', component: SpikeSpikesEditComponent }
          ]
      },
      // Until there are other entities:
      { path: '', redirectTo: 'spike', pathMatch: 'prefix' },
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
    SpikeRouteOutletComponent,
    // Spike Components:
    SpikeSpikesBrowseComponent,
    SpikeSpikesReadComponent,
    SpikeSpikesEditComponent,
    // SubSpike Components:
    SpikesSubSpikeBrowseComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    SpikeSpikesRepositoryService,
    SpikeSubSpikesRepositoryService
  ]
})
export class SpikeModule { }
