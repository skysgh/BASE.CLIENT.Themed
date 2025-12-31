import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/component";
import { LoginComponent } from "./login/component";
// ✅ Auth components from core.ag
import { AuthCallbackComponent } from "../../../../../core.ag/auth/components/auth-callback.component";
import { UnifiedSignUpComponent } from "../../../../../core.ag/auth/components/unified-sign-up.component";
import { UnifiedForgotPasswordComponent } from "../../../../../core.ag/auth/components/unified-forgot-password.component";

const routes: Routes = [
  // =============================================
  // Modern Auth Routes (using core.ag components)
  // =============================================
  
  // Sign In - provider-first login
  {
    path: "signin",
    component: LoginComponent
  },
  
  // Sign Up - provider-first registration
  // Lazy wrapper with theme layout
  {
    path: 'signup', 
    loadChildren: () => import('./auth/signup/module').then(m => m.BaseThemesV1FeaturesSignupModule)
  },
  
  // Forgot Password
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/pass-reset/module').then(m => m.BaseThemesV1FeaturesPassResetModule)
  },
  
  // Reset Password (with token)
  {
    path: 'reset-password',
    loadChildren: () => import('./auth/pass-create/module').then(m => m.BaseThemesV1FeaturesPassCreateModule)
  },
  
  // OAuth/OIDC callback route
  // IdP redirects here after authentication
  {
    path: "callback",
    component: AuthCallbackComponent
  },
  
  // =============================================
  // Legacy/Theme Reference Routes
  // =============================================
  
  // Old signin theme pages
  {
    path: 'auth/signin', 
    loadChildren: () => import('./auth/signin/module').then(m => m.BaseThemesV1FeaturesSigninModule)
  },
  
  // Old signup theme pages  
  {
    path: 'auth/signup', 
    loadChildren: () => import('./auth/signup/module').then(m => m.BaseThemesV1FeaturesSignupModule)
  },
  
  // Pass reset theme pages
  {
    path: 'pass-reset', 
    loadChildren: () => import('./auth/pass-reset/module').then(m => m.BaseThemesV1FeaturesPassResetModule)
  },
  
  // Pass create theme pages
  {
    path: 'pass-create', 
    loadChildren: () => import('./auth/pass-create/module').then(m => m.BaseThemesV1FeaturesPassCreateModule)
  },
  
  // Lockscreen
  {
    path: 'lockscreen', 
    loadChildren: () => import('./auth/lockscreen/module').then(m => m.BaseThemesV1FeaturesLockscreenModule)
  },
  
  // Logout
  {
    path: 'logout', 
    loadChildren: () => import('./auth/logout/module').then(m => m.BaseThemesV1FeaturesLogoutModule)
  },
  
  // Success message
  {
    path: 'success-msg', 
    loadChildren: () => import('./auth/success-msg/module').then(m => m.BaseThemesV1FeaturesSuccessMsgModule)
  },
  
  // Two-step verification
  {
    path: 'twostep', 
    loadChildren: () => import('./auth/twostep/module').then(m => m.BaseThemesV1FeaturesTwostepModule)
  },
  
  // Error pages
  {
    path: 'errors', 
    loadChildren: () => import('../../errors/module').then(m => m.BaseThemesV1FeaturesErrorsModule)
  },
  
  // Legacy register (redirects or keeps for compatibility)
  {
    path: "register",
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseThemesV1UserAccountRoutingModule { }
