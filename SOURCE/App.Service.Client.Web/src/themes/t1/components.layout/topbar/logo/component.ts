// Rx:
import { Observable } from 'rxjs';
//
// Ag:
import { Component, OnInit } from "@angular/core";
// Etc:
// Configuration:
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
import { AccountService } from "../../../../../core/services/account.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
// Models:
import { ViewModel } from "../vm";
// Data:
//

@Component({
    selector: 'app-base-common-components-topbar-languagelogo',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarLogoComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // ✅ Account-aware logo paths
  public logoDark$: Observable<string | undefined>;
  public logoLight$: Observable<string | undefined>;
  public logoSm$: Observable<string | undefined>;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService,
    private navigationService: NavigationService
  ) {
    // ✅ Get logos from account config
    this.logoDark$ = this.accountService.getConfigValue('branding.logo');
    this.logoLight$ = this.accountService.getConfigValue('branding.logoDark');
    this.logoSm$ = this.accountService.getConfigValue('branding.logoSm');
  }

  ngOnInit(): void {
  }

  /**
   * Navigate to account root (e.g., /default/)
   */
  goToAccountRoot(): void {
    const accountRoot = this.navigationService.getUrl('/');
    this.navigationService.navigateByUrl(accountRoot);
  }
}
