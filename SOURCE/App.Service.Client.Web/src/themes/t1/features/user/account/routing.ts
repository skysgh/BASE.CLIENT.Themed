import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/component";
import { LoginComponent } from "./login/component";
import { SignUpComponent } from "./signup/component";
// ✅ Auth components from core.ag
import { AuthCallbackComponent } from "../../../../../core.ag/auth/components/auth-callback.component";

const routes: Routes = [
  // =============================================
  // Modern Auth Routes (using core.ag components)
  // =============================================
  
  // Sign In - provider-first login (THE DEFAULT)
  {
    path: "signin",
    component: LoginComponent
  },
  
  // Sign Up - provider-first registration (THE DEFAULT)
  {
    path: 'signup', 
    component: SignUpComponent
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
  {
    path: "callback",
    component: AuthCallbackComponent
  },
  
  // =============================================
  // Theme Reference Routes (for developer reference)
  // These show different visual styles of auth pages
  // Lazy loaded - the child module defines basic/cover routes
  // =============================================
  
  // Theme reference: signin styles (basic, cover)
  // Full path: /auth/theme-signin/basic or /auth/theme-signin/cover
  {
    path: 'theme-signin', 
    loadChildren: () => import('./auth/signin/module').then(m => m.BaseThemesV1FeaturesSigninModule)
  },
  
  // Theme reference: signup styles
  {
    path: 'theme-signup', 
    loadChildren: () => import('./auth/signup/module').then(m => m.BaseThemesV1FeaturesSignupModule)
  },
  
  // =============================================
  // Support Routes
  // =============================================
  
  // Pass reset
  {
    path: 'pass-reset', 
    loadChildren: () => import('./auth/pass-reset/module').then(m => m.BaseThemesV1FeaturesPassResetModule)
  },
  
  // Pass create
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
  
  // Legacy register
  {
    path: "register",
    component: RegisterComponent
  },
  
  // =============================================
  // Default redirect
  // =============================================
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseThemesV1UserAccountRoutingModule { }
