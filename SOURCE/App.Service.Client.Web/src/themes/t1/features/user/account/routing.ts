import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/component";
import { LoginComponent } from "./login/component";
// ✅ UPDATED: Auth Callback from core.ag
import { AuthCallbackComponent } from "../../../../../core.ag/auth/components/auth-callback.component";

const routes: Routes = [
  {
    path: 'signin', loadChildren: () => import('./auth/signin/module').then(m => m.BaseThemesV1FeaturesSigninModule)
  },
  {
    path: 'signup', loadChildren: () => import('./auth/signup/module').then(m => m.BaseThemesV1FeaturesSignupModule)
  },
  {
    path: 'pass-reset', loadChildren: () => import('./auth/pass-reset/module').then(m => m.BaseThemesV1FeaturesPassResetModule)
  },
  {
    path: 'pass-create', loadChildren: () => import('./auth/pass-create/module').then(m => m.BaseThemesV1FeaturesPassCreateModule)
  },
  {
    path: 'lockscreen', loadChildren: () => import('./auth/lockscreen/module').then(m => m.BaseThemesV1FeaturesLockscreenModule)
  },
  {
    path: 'logout', loadChildren: () => import('./auth/logout/module').then(m => m.BaseThemesV1FeaturesLogoutModule)
  },
  {
    path: 'success-msg', loadChildren: () => import('./auth/success-msg/module').then(m => m.BaseThemesV1FeaturesSuccessMsgModule)
  },
  {
    path: 'twostep', loadChildren: () => import('./auth/twostep/module').then(m => m.BaseThemesV1FeaturesTwostepModule)
  },
  {
    path: 'errors', loadChildren: () => import('../../errors/module').then(m => m.BaseThemesV1FeaturesErrorsModule)
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "signin",
    component: LoginComponent
  },
  // ✅ OAuth/OIDC callback route
  // IdP redirects here after authentication
  {
    path: "callback",
    component: AuthCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseThemesV1UserAccountRoutingModule { }
