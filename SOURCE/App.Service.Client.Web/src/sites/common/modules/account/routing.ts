import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/component";
import { LoginComponent } from "./login/component";

const routes: Routes = [
  {
    path: 'signin', loadChildren: () => import('./auth/signin/module').then(m => m.SigninModule)
  },
  {
    path: 'signup', loadChildren: () => import('./auth/signup/module').then(m => m.SignupModule)
  },
  {
    path: 'pass-reset', loadChildren: () => import('./auth/pass-reset/module').then(m => m.PassResetModule)
  },
  {
    path: 'pass-create', loadChildren: () => import('./auth/pass-create/module').then(m => m.PassCreateModule)
  },
  {
    path: 'lockscreen', loadChildren: () => import('./auth/lockscreen/module').then(m => m.LockscreenModule)
  },
  {
    path: 'logout', loadChildren: () => import('./auth/logout/module').then(m => m.LogoutModule)
  },
  {
    path: 'success-msg', loadChildren: () => import('./auth/success-msg/module').then(m => m.SuccessMsgModule)
  },
  {
    path: 'twostep', loadChildren: () => import('./auth/twostep/module').then(m => m.TwostepModule)
  },
  {
    path: 'errors', loadChildren: () => import('../errors/module').then(m => m.AppBaseCoreErrorsModule)
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "signin",
    component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
