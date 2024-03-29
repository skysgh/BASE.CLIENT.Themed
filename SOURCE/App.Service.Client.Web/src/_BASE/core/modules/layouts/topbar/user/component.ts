// Ag:
import { Component, Inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from '@angular/router';
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// SErvices:
import { SystemService } from "../../../../services/system.service";
import { EventService } from "../../../../services/event.service";
import { AuthenticationService } from "../../../../services/auth.service";
import { AuthfakeauthenticationService } from "../../../../services/authfake.service";
import { TokenStorageService } from '../../../../services/token-storage.service';

@Component({
  selector: 'app-base-common-components-topbar-languageuser',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarUserComponent implements OnInit {

  system = importedSystemConst;


  userData: any;

  constructor(@Inject(DOCUMENT)
  private document: any,
    systemService: SystemService,
    public translate: TranslateService,
    private eventService: EventService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private TokenStorageService: TokenStorageService,
    private router: Router
  ) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
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
    this.router.navigate([this.system.navigation.auth.login]);
  }

}
