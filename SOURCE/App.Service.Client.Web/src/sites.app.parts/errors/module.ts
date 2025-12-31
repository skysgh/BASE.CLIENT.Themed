/**
 * Errors App.Part Module
 * 
 * Platform applet for error page presentation.
 * Lazy loaded - errors are rare, don't preload.
 * 
 * Path: /errors/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ErrorsRoutingModule } from './routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ErrorsRoutingModule
  ],
  exports: []
})
export class ErrorsModule { }
