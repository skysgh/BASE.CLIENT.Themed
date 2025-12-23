
// Ag dependencies:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

// Misc:
//Can Remove: import { TranslateModule } from "@ngx-translate/core";
// NO: Parent Modules:
// NO: import { BaseThemesModule } from "../module";
// Child modules:
import { BaseThemesV1ComponentsModule } from "./components/module";
import { BaseThemesV1DirectivesModule } from "./directives/module";
import { BaseThemesV1PipesModule } from "./pipes/module";
import { BaseThemesV1FeaturesModule } from "./features/module";
//import { BaseThemesV1UnusedModule } from "./unused/module";
import { EffectsModule } from "@ngrx/effects";


// Theme Store:
import { layoutReducer } from "./_state/layout/layout-reducer";

//import { StoreModule } from "@ngrx/store";
import { AuthenticationEffects } from './_state/authentication/authentication.effects';

import { environment } from "../../environments/environment";
import { BaseCoreAgModule } from "../../core.ag/module";
import { BaseThemesV1ComponentsLayoutsModule } from "./components.layout/module";


//import Module specific:
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // Components:
    // N/A
  ],
  providers: [
    // ...not yet...
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    //Can Remove: TranslateModule.forChild(),
    // Specific:
    //NgbNavModule,
    //NgbAccordionModule,
    //NgbDropdownModule,
    //SlickCarouselModule


    // Store: to clarify later:
    StoreModule.forFeature('layout', layoutReducer), // Register layout state as a feature




    // Upstream:
    BaseCoreAgModule,
    // NO: Import Parent Module:
    // NO: BaseThemesModule,
    // Child Modules:
    BaseThemesV1ComponentsLayoutsModule,
    BaseThemesV1ComponentsModule,
    // NO: it defeats the purpose of it being only included in specific cases:
    // NO: BaseThemesV1ComponentsSpecificModule,
    BaseThemesV1DirectivesModule,
    BaseThemesV1FeaturesModule,
    BaseThemesV1PipesModule,
    // NO:BaseThemesV1UnusedModule,
    // Components:
    // N/A
  ],

  exports: [
    BaseCoreAgModule,
    // NO: Export Parent Module:
    // NO: BaseThemesModule,
    // Child Modules:
    BaseThemesV1ComponentsLayoutsModule,
    BaseThemesV1ComponentsModule,
    // NO: it defeats the purpose of it being only included in specific cases:
    // NO: BaseThemesV1ComponentsSpecificModule,
    BaseThemesV1DirectivesModule,
    // Note that this is importing:
    BaseThemesV1FeaturesModule,
    BaseThemesV1PipesModule,
    //NO: BaseThemesV1UnusedModule
  ],
})
export class BaseThemesV1Module { }
