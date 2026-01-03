// Ag:
import { Component, Inject, OnInit, DOCUMENT } from "@angular/core";
import { Router } from '@angular/router';
// Etc:
//
// Configuration:
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { EventService } from "../../../../../core/services/infrastructure/event.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { LogoutService } from "../../../../../core/services/logout.service";
// Models:
import { ViewModel } from "../vm";

/**
 * Default avatar path for users without a custom avatar
 * 
 * Path follows angular.json asset mapping:
 * - Source: src/sites.anon/assets/media/sensitive/images/users/avatar-1.jpg
 * - Runtime: /assets/sites.anon/media/sensitive/images/users/avatar-1.jpg
 */
const DEFAULT_AVATAR_PATH = '/assets/sites.anon/media/sensitive/images/users/avatar-1.jpg';

@Component({
    selector: 'app-base-common-components-topbar-languageuser',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarUserComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  userData: any;
  
  // User avatar URL (from user data or default)
  userAvatarUrl: string = DEFAULT_AVATAR_PATH;

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
    private TokenStorageService: TokenStorageService,
    private router: Router,
    private navigationService: NavigationService,
    private logoutService: LogoutService
  ) {
  }

  ngOnInit(): void {
    this.initUser();
    
    // Build account-aware routes
    // Routes are relative to /apps/ parent route
    // The NavigationService.getUrl() handles account prefixing
    
    // Profile - system authentication module
    this.profileRoute = this.navigationService.getUrl('apps/system/authentication/profile');
    // Settings - unified settings hub
    this.settingsRoute = this.navigationService.getUrl('apps/system/settings');
    // About - system info
    this.aboutRoute = this.navigationService.getUrl('apps/system/about');
    // Support - issue/idea submission (replaces Help)
    this.helpRoute = this.navigationService.getUrl('apps/system/support');
    // Messages - internal messaging
    this.messagesRoute = this.navigationService.getUrl('apps/system/messages');
    // Tasks - spike applet (contains task management)
    this.tasksRoute = this.navigationService.getUrl('apps/spike');
    // Finances - billing module
    this.financesRoute = this.navigationService.getUrl('apps/system/billing');
  }

  private initUser() {
    this.userData = this.TokenStorageService.getUser();
    
    // Set avatar URL from user data or use default
    if (this.userData?.avatar) {
      this.userAvatarUrl = this.userData.avatar;
    } else {
      this.userAvatarUrl = DEFAULT_AVATAR_PATH;
    }
  };

  /**
   * Logout the user
   * Uses LogoutService for coordinated logout across all auth systems
   */
  logout() {
    this.defaultControllerServices.diagnosticsTraceService.info('[TopbarUser] Logout requested');
    
    // Use unified logout service - handles all cleanup and navigation
    this.logoutService.logout({ reason: 'user' });
  }
}
