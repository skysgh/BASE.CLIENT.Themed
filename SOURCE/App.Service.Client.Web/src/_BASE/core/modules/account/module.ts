import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsContainer } from './login/toasts-container.component';

import { SharedModule } from '../../../../app/shared/module';
import { BaseCoreCommonModule } from '../common/module';
import { BaseCoreCommonComponentsModule } from '../common/components/module';

import { AccountRoutingModule } from './routing';
import { SigninModule } from "./auth/signin/module";
import { SignupModule } from "./auth/signup/module";
import { RegisterComponent } from './register/component';
import { LoginComponent } from './login/component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ToastsContainer
  ],
  imports: [
    CommonModule,
    BaseCoreCommonModule,
    BaseCoreCommonComponentsModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    AccountRoutingModule,
    SigninModule,
    NgbToastModule,

    //SharedModule,
    BaseCoreCommonModule
  ]
})
export class BaseCoreAccountModule { }
