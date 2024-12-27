// Ag dependencies:
import { CommonModule } from "@angular/common";
// Misc:
import { TranslateModule } from "@ngx-translate/core";

import { BaseCoreUIModule } from "../../core.ui/module";
import { BaseThemesV1DirectivesModule } from "./directives/module";
import { BaseThemesV1PipesModule } from "./pipes/module";
import { NgModule } from "@angular/core";
import { BaseThemesV1ModulesModule } from "./modules/module";

//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,

    TranslateModule.forChild(),

    //
    BaseCoreUIModule,

    BaseThemesV1PipesModule,
    BaseThemesV1DirectivesModule,
    BaseThemesV1ModulesModule,
    //// Module specific:
    //// No components
    //NgbNavModule,
    //NgbAccordionModule,
    //NgbDropdownModule,
    //SlickCarouselModule

  ],

  declarations: [
  ],
  providers: [
  ],
  exports: [
    BaseCoreUIModule,

    BaseThemesV1DirectivesModule,
    BaseThemesV1PipesModule,
    BaseThemesV1PipesModule,
  ]
})
export class BaseThemeV1Module { }
