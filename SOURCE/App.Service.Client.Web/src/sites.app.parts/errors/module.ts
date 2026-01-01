/**
 * Errors App.Part Module
 * 
 * Platform applet for error page presentation.
 * Lazy loaded - errors are rare, don't preload.
 * 
 * Uses parameterized error component that handles all error codes.
 * 
 * Path: /errors/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ErrorsRoutingModule } from './routing';
import { ErrorComponent } from './views/error/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ErrorsRoutingModule,
    ErrorComponent
  ],
  exports: []
})
export class ErrorsModule { }
