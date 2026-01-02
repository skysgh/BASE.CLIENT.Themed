/**
 * Surveys Module
 * 
 * Configurable surveys with conditional branching.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { surveyRoutes } from './routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(surveyRoutes),
  ],
  exports: [RouterModule]
})
export class SurveysModule {}
