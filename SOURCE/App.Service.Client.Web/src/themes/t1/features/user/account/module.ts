import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsContainer } from './login/toasts-container.component';


// NO: Parent Module:
// NO: import { BaseThemesV1FeaturesModule } from '../../module';
// Routing Modules:
import { BaseThemesV1UserAccountRoutingModule } from './routing';


import { BaseThemesV1FeaturesSigninModule } from "./auth/signin/module";
import { BaseThemesV1FeaturesSignupModule } from "./auth/signup/module";
import { RegisterComponent } from './register/component';
import { LoginComponent } from './login/component';
import { SignUpComponent } from './signup/component';
import { BaseThemesModule } from '../../../../module';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { BaseCoreAgModule } from '../../../../../core.ag/module';
import { BaseThemesV1ComponentsModule } from '../../../components/module';
import { BaseThemesV1Module } from '../../../module';

// ✅ UPDATED: Auth Components from core.ag
import { AuthProviderListComponent } from '../../../../../core.ag/auth/ui/widgets/auth-provider-list.component';
import { EmailLoginFormComponent } from '../../../../../core.ag/auth/ui/widgets/email-login-form.component';
import { EmailSignupFormComponent } from '../../../../../core.ag/auth/ui/widgets/email-signup-form.component';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    RegisterComponent,
    LoginComponent,
    SignUpComponent,
    ToastsContainer
  ],
  providers:[],
  imports: [
    CommonModule,
    // BaseCoreCommonComponentsModule,
    //Can Remove: TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,

    // ✅ Standalone Auth Components (from core.ag)
    AuthProviderListComponent,
    EmailLoginFormComponent,
    EmailSignupFormComponent,

    // Import upstream:
    BaseThemesModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesModule,
    // This Module contains routes:
    BaseThemesV1UserAccountRoutingModule,
    // Child Modules:
    BaseThemesV1FeaturesSignupModule,
    BaseThemesV1FeaturesSigninModule,
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1FeaturesModule,
    // Child Modules:
    BaseThemesV1FeaturesSignupModule,
    BaseThemesV1FeaturesSigninModule
  ]
})
export class BaseThemesV1FeaturesUserAccountModule { }

