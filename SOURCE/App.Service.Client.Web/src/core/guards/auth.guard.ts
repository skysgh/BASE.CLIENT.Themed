// Ag:
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Const:

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../environments/environment';
import { appsConfiguration } from '../../apps/configuration/implementations/apps.configuration';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (environment.defaultauth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser) {
                // logged in so return true
                return true;
            }
        } else {
            const currentUser = this.authFackservice.currentUserValue;
            if (currentUser) {
                // logged in so return true
                return true;
            }
            // check if user data is in storage is logged in via API.
          if (sessionStorage.getItem(this.appsConfiguration.others.core.constants.storage.session.currentUser)) {
                return true;
        }
        // not logged in so redirect to login page with the return url
            }
        this.router.navigate([this.appsConfiguration.navigation.auth.login], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
