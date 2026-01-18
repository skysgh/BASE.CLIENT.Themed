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
import { AccountService } from "../../../../../core/services/account.service";
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
/**
 * User Menu Component (Topbar)
 * 
 * Displays user avatar and dropdown menu with:
 * - Profile
 * - Messages (configurable)
 * - Tasks (configurable)
 * - Help/Support (configurable)
 * - Finances (configurable)
 * - Settings
 * - About
 * - Logout
 * 
 * VISIBILITY:
 * Menu items controlled by account feature flags:
 * - `features.showUserMenuFinances` (default: true)
 * - `features.showUserMenuMessages` (default: true)
 * - `features.showUserMenuTasks` (default: true)
 * - `features.showUserMenuHelp` (default: true)
 */
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

  // Feature flags for menu items
  showProfile: boolean = true;
  showFinances: boolean = true;
  showMessages: boolean = true;
  showTasks: boolean = true;
  showHelp: boolean = true;

  constructor(@Inject(DOCUMENT)
  private document: any,
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService,
    private TokenStorageService: TokenStorageService,
    private router: Router,
    private navigationService: NavigationService,
    private logoutService: LogoutService,
    private accountService: AccountService
  ) {
    // Load feature flags from account config
    this.loadFeatureFlags();
  }

  ngOnInit(): void {
    this.initUser();
    
    // Build account-aware routes
    // Route structure after restructuring:
    // - /apps/*   → Domain applets (sites.app.lets/) - spike, faq, surveys
    // - /system/* → Platform parts (sites.app.parts/) - hub, settings, trash, etc.
    // The NavigationService.getUrl() handles account prefixing
    
    // Profile - Profile Hub (identity info)
    // Note: Profile is always user-scoped, so it goes to /system/profile
    // not through Settings. But Settings also has a gateway tile to Profile.
    this.profileRoute = this.navigationService.getUrl('system/profile');
    // Settings - unified settings hub
    this.settingsRoute = this.navigationService.getUrl('system/settings');
    // About - system info
    this.aboutRoute = this.navigationService.getUrl('system/about');
    // Support - issue/idea submission (replaces Help)
    this.helpRoute = this.navigationService.getUrl('system/support');
    // Messages - internal messaging
    this.messagesRoute = this.navigationService.getUrl('system/messages');
    // Tasks - spike applet (domain applet)
    this.tasksRoute = this.navigationService.getUrl('apps/spike');
    // Finances - billing module
    this.financesRoute = this.navigationService.getUrl('system/billing');
  }

  /**
   * Load feature flags from account configuration
   */
  private loadFeatureFlags(): void {
    // Profile visibility in dropdown (can be hidden if prefer through Settings)
    this.accountService.getConfigValue<boolean>('features.showUserMenuProfile').subscribe(enabled => {
      this.showProfile = enabled ?? true;
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - showProfile: ${this.showProfile}`
      );
    });

    // Finances visibility
    this.accountService.getConfigValue<boolean>('features.showUserMenuFinances').subscribe(enabled => {
      this.showFinances = enabled ?? true;
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - showFinances: ${this.showFinances}`
      );
    });

    // Messages visibility
    this.accountService.getConfigValue<boolean>('features.showUserMenuMessages').subscribe(enabled => {
      this.showMessages = enabled ?? true;
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - showMessages: ${this.showMessages}`
      );
    });

    // Tasks visibility
    this.accountService.getConfigValue<boolean>('features.showUserMenuTasks').subscribe(enabled => {
      this.showTasks = enabled ?? true;
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - showTasks: ${this.showTasks}`
      );
    });

    // Help/Support visibility
    this.accountService.getConfigValue<boolean>('features.showUserMenuHelp').subscribe(enabled => {
      this.showHelp = enabled ?? true;
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - showHelp: ${this.showHelp}`
      );
    });
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
