import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// NO: Parent Module:
// NO: import { BaseCoreAgModule } from '../module';


/**
 * Non-theme specific Directives.
 *
 * Note:
 * For Theme specific Directives,
 * see 'BaseThemesV1DirectivesModule'.
 */
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    CommonModule,
    // NO: Import Parent Module:
    // NO: BaseCoreAgModule
    // No Child Modules:
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseCoreAgSupportModule
    // Directives have to be Exported to be used everywhere else in the app.
  ]
})
export class BaseCoreAgDirectivesModule { }
