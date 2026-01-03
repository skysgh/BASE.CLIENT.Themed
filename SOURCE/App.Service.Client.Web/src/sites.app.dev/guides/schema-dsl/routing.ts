/**
 * Schema DSL Guides Routing
 * 
 * Routes for Entity Schema DSL documentation articles.
 * 
 * Structure:
 * /dev/guides/schema-dsl/           → Hub (overview of all articles)
 * /dev/guides/schema-dsl/overview   → Concepts & BREAD pattern
 * /dev/guides/schema-dsl/entity     → Entity definition
 * /dev/guides/schema-dsl/cards      → UniversalCard mapping
 * /dev/guides/schema-dsl/browse     → Browse view schema
 * /dev/guides/schema-dsl/forms      → Form schemas (Formly)
 * /dev/guides/schema-dsl/example    → Complete Spike example
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchemaDslHubComponent } from './ui/views/schema-dsl-hub/component';
import { OverviewArticleComponent } from './ui/views/articles/overview/component';
import { EntityDefinitionArticleComponent } from './ui/views/articles/entity-definition/component';
import { UniversalCardArticleComponent } from './ui/views/articles/universal-card/component';
import { BrowseViewArticleComponent } from './ui/views/articles/browse-view/component';
import { FormSchemaArticleComponent } from './ui/views/articles/form-schema/component';
import { CompleteExampleArticleComponent } from './ui/views/articles/complete-example/component';

const routes: Routes = [
  // Hub - overview of all schema DSL articles
  {
    path: '',
    component: SchemaDslHubComponent
  },
  
  // Articles
  {
    path: 'overview',
    component: OverviewArticleComponent
  },
  {
    path: 'entity',
    component: EntityDefinitionArticleComponent
  },
  {
    path: 'cards',
    component: UniversalCardArticleComponent
  },
  {
    path: 'browse',
    component: BrowseViewArticleComponent
  },
  {
    path: 'forms',
    component: FormSchemaArticleComponent
  },
  {
    path: 'example',
    component: CompleteExampleArticleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaDslRoutingModule { }
