import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component
import { Error404RoutingModule } from "./routing.module";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { AltComponent } from './alt/component';
import { Page500Component } from './page500/component';
import { TranslateModule } from '@ngx-translate/core';
import { OfflineComponent } from './offline/component';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent,
    AltComponent,
    OfflineComponent,
    Page500Component
  ],
  imports: [
    TranslateModule,
    CommonModule,
    Error404RoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppBaseErrorsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
