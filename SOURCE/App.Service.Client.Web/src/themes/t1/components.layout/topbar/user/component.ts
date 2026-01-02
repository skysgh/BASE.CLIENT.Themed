// Ag:
import { Component, Inject, OnInit, DOCUMENT } from "@angular/core";

import { Router } from '@angular/router';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
import { AuthenticationService } from "../../../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../../../core/services/authfake.service";
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { EventService } from "../../../../../core/services/infrastructure/event.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
// Models:
import { ViewModel } from "../vm";

@Component({
    selector: 'app-base-common-components-topbar-languageuser',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarUserComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  userData: any;

  // Account-aware routes
  profileRoute: string = '';
  settingsRoute: string = '';
  aboutRoute: string = '';
  helpRoute: string = '';
  messagesRoute: string = '';
  tasksRoute: string = '';
  financesRoute: string = '';

  constructor(@Inject(DOCUMENT)
  private document: any,
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private TokenStorageService: TokenStorageService,
    private router: Router,
    private navigationService: NavigationService
  ) {
  }

  ngOnInit(): void {
    this.initUser();
    
    // Build account-aware routes
    // Profile goes to system-profile (person's profile across the system)
    this.profileRoute = this.navigationService.getUrl('apps/system/authentication/profile');
    // Settings goes to settings hub
    this.settingsRoute = this.navigationService.getUrl('apps/system/settings');
    // Other routes
    this.aboutRoute = this.navigationService.getUrl('apps/system/about');
    this.helpRoute = this.navigationService.getUrl('apps/system/help');
    this.messagesRoute = this.navigationService.getUrl('apps/system/messages');
    this.tasksRoute = this.navigationService.getUrl('apps/system/tasks');
    this.financesRoute = this.navigationService.getUrl('apps/system/billing');
  }

  private initUser() {
    this.userData = this.TokenStorageService.getUser();
  };

  /**
   * Logout the user
   * Clears all session storage and navigates to sign-in page
   */
  logout() {
    console.log('[TopbarUser] Logging out...');
    
    // Clear auth service state
    this.authService.logout();
    
    // Clear fake auth service state (used by FakeAuthRepository)
    this.authFackservice.logout();
    
    // Clear all session storage keys used by auth
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentPerson');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('toast');
    sessionStorage.removeItem('oidc_session');
    sessionStorage.removeItem('oidc_auth_state');
    
    console.log('[TopbarUser] Session cleared, navigating to sign-in');
    
    // Navigate to sign-in (account-aware)
    this.navigationService.navigateToSignIn();
  }
}
