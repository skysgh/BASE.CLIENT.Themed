import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { LockScreenRoutingModule } from "./routing.module";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    LockScreenRoutingModule
  ]
})
export class LockscreenModule { }
