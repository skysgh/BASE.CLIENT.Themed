// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Misc:
import { TranslateModule } from '@ngx-translate/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';

// pipes:

// directives:

// Services:
import { matchesProperty } from 'lodash';

// Import child Modules:
import { BaseCoreUIDirectivesModule } from './directives/module';
import { BaseCoreUIPipesModule } from './pipes/module';
import { BaseCoreUIComponentsModule } from './components/module';


//import Module specific:
/**
 * Module that contains all the *non-app-specific* (ie portable) core UI components, directives and pipes.
 */

@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    TranslateModule.forChild(),
    // Module specific:
    // No components
    // child modules
    BaseCoreUIDirectivesModule,
    BaseCoreUIPipesModule,
    BaseCoreUIComponentsModule
  ],

  declarations: [
    //directives
    // pipes
    // etc.
  ],
  providers: [
    // services...
  ],
  exports: [
    BaseCoreUIDirectivesModule,
    BaseCoreUIPipesModule,
    BaseCoreUIComponentsModule
  ]
})
export class BaseCoreUIModule { }
