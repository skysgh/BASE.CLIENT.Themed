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
import { BaseThemesModule } from '../../../../module';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { BaseCoreAgModule } from '../../../../../core.ag/module';
import { BaseThemesV1ComponentsModule } from '../../../components/module';
import { BaseThemesV1Module } from '../../../module';

// ✅ Auth Components (standalone)
import { AuthProviderListComponent } from '../../../../../core/auth/components/auth-provider-list.component';
import { EmailLoginFormComponent } from '../../../../../core/auth/components/email-login-form.component';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    RegisterComponent,
    LoginComponent,
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

    // ✅ Standalone Auth Components
    AuthProviderListComponent,
    EmailLoginFormComponent,

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

