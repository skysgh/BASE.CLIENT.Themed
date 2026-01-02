/**
 * Tables Reference Module
 * 
 * Near-direct copy from Velzon theme: pages/tables
 * Provides table/grid reference pages for developers.
 * 
 * Source: Velzon (Minimal) - tables module
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Ng Search 
import { NgPipesModule } from 'ngx-pipes';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Load Icon
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Compatibility shim for breadcrumbs
import { DevBreadcrumbsComponent } from '../../ui/widgets/breadcrumbs/component';

// Routing
import { TablesReferenceRoutingModule } from './routing';

// Component pages
import { BasicComponent } from './basic/basic.component';
import { GridjsComponent } from './gridjs/gridjs.component';
import { ListjsComponent } from './listjs/listjs.component';
import { NgbdOrdersSortableHeader } from './listjs/listjs-sortable.directive';

@NgModule({
  declarations: [
    BasicComponent,
    GridjsComponent,
    ListjsComponent,
    NgbdOrdersSortableHeader
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    TablesReferenceRoutingModule,
    DevBreadcrumbsComponent,
    SimplebarAngularModule,
    NgPipesModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TablesReferenceModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
