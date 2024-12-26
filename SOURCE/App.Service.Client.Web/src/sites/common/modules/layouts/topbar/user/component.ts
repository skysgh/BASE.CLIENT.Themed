// Ag:
import { Component, Inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from '@angular/router';
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Pipes:
import { BaseTranslatePipe } from '../../../../../../core.ui/pipes/basetranslate.pipe';
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// SErvices:
import { SystemService } from "../../../../../../core/services/system.service";
import { AuthenticationService } from "../../../../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../../../../core/services/authfake.service";
import { TokenStorageService } from '../../../../../../core/services/token-storage.service';
import { EventService } from "../../../../../../core/services/infrastructure/event.service";
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languageuser',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarUserComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


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
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
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
