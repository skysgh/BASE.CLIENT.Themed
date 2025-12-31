/**
 * Integrations Module
 * 
 * Developer documentation for external service integrations.
 * 
 * Path: /dev/integrations/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IntegrationsRoutingModule } from './routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    IntegrationsRoutingModule
  ],
  exports: []
})
export class IntegrationsModule { }
