/**
 * Schema DSL Guides Module
 * 
 * Developer documentation for the Entity Schema DSL system.
 * 
 * Covers:
 * - Entity Schema structure and concepts
 * - Field definitions and lookups
 * - UniversalCard mapping for browse views
 * - Form schemas (Formly) for edit/add/view
 * - Complete working examples
 * 
 * Route: /dev/guides/schema-dsl/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SchemaDslRoutingModule } from './routing';
import { SchemaDslHubComponent } from './ui/views/schema-dsl-hub/component';
import { OverviewArticleComponent } from './ui/views/articles/overview/component';
import { EntityDefinitionArticleComponent } from './ui/views/articles/entity-definition/component';
import { UniversalCardArticleComponent } from './ui/views/articles/universal-card/component';
import { BrowseViewArticleComponent } from './ui/views/articles/browse-view/component';
import { FormSchemaArticleComponent } from './ui/views/articles/form-schema/component';
import { CompleteExampleArticleComponent } from './ui/views/articles/complete-example/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SchemaDslRoutingModule,
    // Standalone components
    SchemaDslHubComponent,
    OverviewArticleComponent,
    EntityDefinitionArticleComponent,
    UniversalCardArticleComponent,
    BrowseViewArticleComponent,
    FormSchemaArticleComponent,
    CompleteExampleArticleComponent
  ],
  exports: []
})
export class SchemaDslGuidesModule { }
