//// Import Ag:
//import { NgModule } from '@angular/core';
//import { Routes, RouterModule } from '@angular/router';
//// Import Commons:

//// Import SubModules:
////import { SpikeSpikesModule } from "./modules/spike/module";

//// Import Modules Specific:
//import { SpikesRouteComponent } from './ui/_route/component';

//import { SpikeSpikesBrowseComponent } from './modules/spike/ui/browse/component';
//import { SpikeSpikesReadComponent } from './modules/spike/ui/read/component';
//import { SpikeSpikesEditComponent } from './modules/spike/ui/edit/component';

//const routes: Routes = [
//  // we're basically saying load a control from this module,
//  // which happens to be a router-output, and into that
//  // load the module for specific group of views:
//  {
//    path: 'spike', component: SpikesRouteComponent,
//    //loadChildren: () => import('./modules/spike/module').then(m => m.SpikeSpikesModule), /*canActivate: [AuthGuard]*/
//    children:
//      [
//        { path: '', component: SpikeSpikesBrowseComponent },
//        { path: 'browse', redirectTo: '', pathMatch: 'prefix' },
//        { path: 'list', redirectTo: '', pathMatch: 'prefix' },

//        { path: ':id', component: SpikeSpikesReadComponent },
//        { path: 'view/:id', redirectTo: ':id', pathMatch: 'prefix' },
//        //    { path: 'read/:id', redirectTo: ':id', pathMatch: 'prefix' },
//        { path: 'edit/:id', component: SpikeSpikesEditComponent } 
//    ]
//  },
//  // Until there are other entities:
//  { path: '', redirectTo: 'spike', pathMatch: 'prefix' },
//];

//@NgModule({
//  imports: [RouterModule.forChild(routes)],
//  exports: [RouterModule]
//})

//export class SpikesRoutingModule { }
