// Ag:
import { Component, OnInit, EventEmitter, Output, Inject, DOCUMENT } from '@angular/core';

// Rx:
// Etc:
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
// Constants:
import { LAYOUT_MODE, SIDEBAR_SIZE, SIDEBAR_IMAGE } from '../../_state/layout/layout-constants';
// Configuration:
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
import { EventService } from '../../../../core/services/infrastructure/event.service';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../core/services/authfake.service';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
// Operate Applet (now in sites.app.parts):
import { ServiceOperateLanguageService } from '../../../../sites.app.parts/operate/services/service-operate-language.service';
import { ServiceOperateNotificationService } from '../../../../sites.app.parts/operate/services/service-operate-notification.service';
import { ServiceOperateLanguageViewModel } from '../../../../sites.app.parts/operate/models/view-models/service-operate-language.view-model';
import { ServiceOperateNotificationViewModel } from '../../../../sites.app.parts/operate/models/view-models/service-operate-notification.view-model';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    standalone: false
})
export class BaseLayoutTopBarComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  @Output() mobileMenuButtonClicked = new EventEmitter();

  isDropdownOpen = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private defaultComponentServices: DefaultComponentServices,
    private eventService: EventService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
  }

  ngOnInit(): void {
  }

  onMobileMenuButtonClicked() {
    this.mobileMenuButtonClicked.emit();
  }

  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
