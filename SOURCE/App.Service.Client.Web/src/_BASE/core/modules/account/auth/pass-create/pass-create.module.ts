import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { PassCreateRoutingModule } from "./pass-create-routing.module";
import { BasicComponent } from './basic/basic.component';
import { CoverComponent } from './cover/cover.component';
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
    PassCreateRoutingModule
  ]
})
export class PassCreateModule { 
  
}
