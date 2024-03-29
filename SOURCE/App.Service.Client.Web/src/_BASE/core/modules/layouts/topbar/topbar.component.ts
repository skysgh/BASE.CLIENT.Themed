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
import { system as importedSystemConst } from '../../../constants/system';

//Logout
//import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../services/auth.service';
import { AuthfakeauthenticationService } from '../../../services/authfake.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { LanguageService } from '../../../services/language.service';

//import { allNotification, messages } from './data'
//import { CartModel } from './topbar.model';
//import { cartData } from './data';
//  Base Services:
import { SystemService } from '../../../services/system.service';
import { SystemNotificationService } from '../../../services/notification.service';
import { DiagnosticsTraceService } from '../../../services/diagnostics.service';
import { EventService } from '../../../services/event.service';
// Base Models:
import { SystemLanguage } from '../../../models/data/system-language.model';
//
import { SystemNotification } from '../../../models/data/notification.model';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class BaseLayoutTopBarComponent implements OnInit {

  @Output() mobileMenuButtonClicked = new EventEmitter();

  isDropdownOpen = false;
  system = importedSystemConst;

  constructor(@Inject(DOCUMENT)
    private document: any,
    systemService: SystemService, 
    protected diagnosticsTraceService :DiagnosticsTraceService,
    //private systemNotificationService: SystemNotificationService,
    private eventService: EventService,
    public languageService: LanguageService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private router: Router,
    private TokenStorageService: TokenStorageService
  ) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
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
