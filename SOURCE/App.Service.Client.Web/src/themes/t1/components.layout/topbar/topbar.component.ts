//import { listLang } from '../../../../shared/settings/constants/languages';

// Rx:
import { Observable, of } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
// Ag:
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, EventEmitter, Output, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
// Etc:
import { CookieService } from 'ngx-cookie-service';

//Logout
//import { environment } from '../../../../environments/environment';

// Services:

//import { allNotification, messages } from './data'
//import { CartModel } from './topbar.model';
//import { cartData } from './data';
//  Base Services:

// Configuration:
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
import { EventService } from '../../../../core/services/infrastructure/event.service';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../core/services/authfake.service';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
// Base Models:
import { ViewModel } from './vm';
import { ServiceLanguage } from '../../../../core/models/data/service-language.model';
import { ServiceNotification } from '../../../../core/models/data/service-notification.model';
// Data:
//

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class BaseLayoutTopBarComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Output() mobileMenuButtonClicked = new EventEmitter();

  isDropdownOpen = false;

  constructor(@Inject(DOCUMENT)
  private document: any,
    private defaultComponentServices: DefaultComponentServices,
    //private serviceNotificationsService: serviceNotificationsService,
    private eventService: EventService,
    //public languageService: LanguageService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private router: Router,
    private TokenStorageService: TokenStorageService
  ) {
    // Make system/env variables avaiable to view template (via const or service):
    
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
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = true;
    }
  }
}
