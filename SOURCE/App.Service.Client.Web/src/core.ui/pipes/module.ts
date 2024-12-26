import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Imports pipes
import { EnabledPipe } from './enabled.pipe';
import { MatchesPipe } from './matches.pipe';
import { BaseTranslatePipe } from './basetranslate.pipe';

@NgModule({
  declarations: [
    EnabledPipe,
    MatchesPipe,
    BaseTranslatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EnabledPipe,
    MatchesPipe,
    BaseTranslatePipe
  ]
})
export class BaseCoreUIPipesModule { }
