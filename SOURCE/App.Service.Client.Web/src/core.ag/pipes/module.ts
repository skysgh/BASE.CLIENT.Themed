import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Imports pipes
import { EnabledPipe } from './enabled.pipe';
import { MatchesPipe } from './matches.pipe';
import { BaseTranslatePipe } from './basetranslate.pipe';
import { CapitalizePipe } from './capitalise.pipe';

// NO: Parent Module:
// import { BaseCoreAgModule } from '../module';

/**
 * Non theme-specific Pipes.
 *
 * Important:
 * These include the very important 'baseTranslate'
 * pipe that is used everywhere in the app's
 * component html.
 *
 * Note:
 * For theme-specific pipes, see
 * 'BaseThemesV1PipesModule'.
 */
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseTranslatePipe,
    CapitalizePipe,
    EnabledPipe,
    MatchesPipe
  ],
  imports: [
    CommonModule,
    // NO: Import: Parent Module:
    // NO: BaseCoreAgModule,
    // No Child Modules:
    // N/A
  ],
  exports: [
    // NO: Parent Module:
    // NO: BaseCoreAgSupportModule,
    // No Child Modules:
    // N/A
    // Pipes, to be used elsewhere (ie everywhere):
    BaseTranslatePipe,
    CapitalizePipe,
    EnabledPipe,
    MatchesPipe
  ]
})
export class BaseCoreAgPipesModule { }
