import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// otp module
import { NgOtpInputModule } from 'ng-otp-input';

// Component
import { TwoStepRoutingModule } from "./routing.module";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    TwoStepRoutingModule
  ]
})
export class TwostepModule { }
