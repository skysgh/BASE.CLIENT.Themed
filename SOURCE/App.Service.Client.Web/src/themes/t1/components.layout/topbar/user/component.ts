// Ag:
import { Component, Inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from '@angular/router';
// Etc:
//
// Configuration:
import { appsConfiguration } from "../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
import { AuthenticationService } from "../../../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../../../core/services/authfake.service";
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { EventService } from "../../../../../core/services/infrastructure/event.service";
// Models:
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languageuser',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarUserComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  userData: any;

  constructor(@Inject(DOCUMENT)
  private document: any,
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private TokenStorageService: TokenStorageService,
    private router: Router
  ) {
    // Make system/env variables avaiable to view template (via const or service):
    
  }

  ngOnInit(): void {
    this.initUser();
  }

  private initUser() {
    this.userData = this.TokenStorageService.getUser();
  };

  /**
 * Logout the user
 */
  logout() {
    this.authService.logout();
    this.router.navigate([this.appsConfiguration.navigation.auth.login]);
  }

}
