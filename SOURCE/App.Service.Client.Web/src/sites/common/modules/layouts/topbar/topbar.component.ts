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
import { TranslateService } from '@ngx-translate/core';

// Constants:
import { system as importedSystemConst } from '../../../../../core/constants/system';

//Logout
//import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../core/services/authfake.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';

//import { allNotification, messages } from './data'
//import { CartModel } from './topbar.model';
//import { cartData } from './data';
//  Base Services:
import { SystemService } from '../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
// Base Models:
import { ServiceLanguage } from '../../../../../core/models/data/service-language.model';
import { ServiceNotification } from '../../../../../core/models/data/service-notification.model';
import { EventService } from '../../../../../core/services/infrastructure/event.service';
import { ViewModel } from './vm';
// Data:

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class BaseLayoutTopBarComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Output() mobileMenuButtonClicked = new EventEmitter();

  isDropdownOpen = false;

  constructor(@Inject(DOCUMENT)
    private document: any,
    systemService: SystemService, 
    protected diagnosticsTraceService :SystemDiagnosticsTraceService,
    //private serviceNotificationsService: serviceNotificationsService,
    private eventService: EventService,
    //public languageService: LanguageService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private router: Router,
    private TokenStorageService: TokenStorageService
  ) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
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
