//import { listLang } from '../../../_BASE/shared/settings/constants/languages';

// Rx:
import { Observable, of } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
// Ag:
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, EventEmitter, Output, Inject, ViewChild, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

//Logout
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../../_BASE/shared/services/auth.service';
import { AuthfakeauthenticationService } from '../../../_BASE/shared/services/authfake.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../_BASE/shared/services/token-storage.service';

// Language
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../../_BASE/shared/services/language.service';
import { TranslateService } from '@ngx-translate/core';

//import { allNotification, messages } from './data'
import { CartModel } from './topbar.model';
import { cartData } from './data';
//  Base Services:
import { SystemService } from '../../../_BASE/shared/services/system.service';
import { SystemNotificationService } from '../../../_BASE/shared/services/notification.service';
import { DiagnosticsTraceService } from '../../../_BASE/shared/services/diagnostics.service';
import { EventService } from '../../../_BASE/shared/services/event.service';
// Base Models:
import { SystemLanguage } from '../../../_BASE/shared/models/data/system-language';
// Constants:
import { System } from '../../../_BASE/shared/constants/contracts/system';
import { SystemNotification } from '../../../_BASE/shared/models/data/notification.model';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  messages: any
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  // NOtificationService lists:
  allnotifications: any
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  notifyId: any;

  flagStuff: any= {
    "flagvalue": '',
    "valueset":'',
  }

  // Language: stuff:
  flagvalue: string = '';
  valueset: string='';
  languageTitle: string='';
  cookieValue: any;
  // Unknown - languages?
  isDropdownOpen = false;
  // User
  userData: any;
  // Shopping
  cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;

  // CHECK:
  @ViewChild('removenotification') removenotification !: TemplateRef<any>;

  // Exposed properties:
  system: System;
  public systemLanguages$: Observable<SystemLanguage[]> = of ([]);
  public notificationsAll$: Observable<SystemNotification[]> = of([]);
  public notificationsMessages$: Observable<SystemNotification[]> = of([]);
  public notificationsAlerts$: Observable<SystemNotification[]> = of([]);

  constructor(@Inject(DOCUMENT)
    private document: any,
    systemService: SystemService, 
    protected diagnosticsTraceService :DiagnosticsTraceService,
    private systemNotificationService: SystemNotificationService,
    private eventService: EventService,
    public languageService: LanguageService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private router: Router, private TokenStorageService: TokenStorageService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }
    

  ngOnInit(): void {
    this.element = document.documentElement;


    this.initUser();
    this.initLanguages();
    this.initMessages();
    this.initCart();
  }

  private initUser() {
    this.userData = this.TokenStorageService.getUser();
  };

  private initLanguages() {
    // This will take a sec to retrieve:
    this.languageService
      .items$
      .subscribe(x => {

        if (x.length == 0) {
          this.diagnosticsTraceService.info("...early exit...");
          return;
        }

        // Cookies wise Language set
        this.cookieValue = this._cookiesService.get('lang') || 'en';
        this.diagnosticsTraceService.info("cookie value:" + this.cookieValue);

        this.diagnosticsTraceService.info("...processing...");
        this.diagnosticsTraceService.info("Number of languages is:" + x.length);

        //Get an array of one, matching current language description:
        var tmp = x.filter(x => x.languageCode === this.cookieValue);

        if (tmp.length === 0) {
          // NO match, so can't set to a specific flag. Fallback:
          this.languageTitle = '...';
          this.valueset = this.system.sources.images.flags + '/00.svg';
          this.flagvalue = this.system.sources.images.flags + '/00.svg';
        } else {
          //tmp = tmp[0];
          // Match. So image will be ok.
          // And we can also set the language title.
          this.languageTitle = tmp[0].title;

          this.diagnosticsTraceService.info("languageTitle:" + this.languageTitle);
          // go through array of 1:
          // and get it's flag url:
          this.flagvalue = `${this.system.sources.images.flags}${tmp[0].languageCode}.svg`;
        }
        this.diagnosticsTraceService.info("valueset:" + this.valueset);
        this.diagnosticsTraceService.info("FlagValue:" + this.flagvalue);

        this.systemLanguages$ = of(x);

    });

  }
  private initMessages() {
    this.systemNotificationService
      .mappedItems$
      .subscribe(x => {
        // Fetch Data
        this.notificationsAll$ = of(x) ;
      });

    this.systemNotificationService
      .filteredMappedItems$
      .subscribe(x => {
        // Fetch Data
        this.notificationsMessages$ = of(x);
      });
  }

  private initCart() {
    this.cartData = cartData;
    this.cart_length = this.cartData.length;
    this.cartData.forEach((item) => {
      var item_price = item.quantity * item.price
      this.total += item_price
    });
  }
  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  /**
* Open modal
* @param content modal content
*/
  openModal(content: any) {
    // this.submitted = false;
    this.modalService.open(content, { centered: true });
  }


  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
      case 'dark':
        document.documentElement.setAttribute('data-bs-theme', "dark");
        break;
      default:
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
    }
  }
  //setLanguageByCode(languageCode: string) {
  //  const val = this.systemLanguages.pipe(map(x=>x. )).filter(x => x.languageCode === languageCode);
  //}

  /***
   * Language Value Set
   */
  setLanguage(systemLanguage: SystemLanguage) {
    if (systemLanguage) {
      this.languageTitle = systemLanguage.title;
      this.flagvalue = `${this.system.sources.images.flags}${systemLanguage.languageCode}.svg`;
      this.cookieValue = systemLanguage.languageCode ?? 'en';
      this.languageService.setLanguage(systemLanguage.languageCode ?? 'en');
    }
  }

  trackByCountryCode(index: number, item: SystemLanguage) {
    console.log(item.description);
    //this.diagnosticsTraceService.info(item.description);
    return item.languageCode;
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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

  // Delete Item
  deleteItem(event: any, id: any) {
    var price = event.target.closest('.dropdown-item').querySelector('.item_price').innerHTML;
    var Total_price = this.total - price;
    this.total = Total_price;
    this.cart_length = this.cart_length - 1;
    this.total > 1 ? (document.getElementById("empty-cart") as HTMLElement).style.display = "none" : (document.getElementById("empty-cart") as HTMLElement).style.display = "block";
    document.getElementById('item_' + id)?.remove();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = true;
    }
  }
  // Search Topbar
  Search() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = ''
        if (element.querySelector("h6")) {
          var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
          var name = element.querySelector("h6").innerText.toLowerCase()
          if (name.includes(inputVal)) {
            notifiTxt = name
          } else {
            notifiTxt = spantext
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

  // Remove Notification
  checkedValGet: any[] = [];
  onCheckboxChange(event: any, id: any) {
    this.notifyId = id
    var result;
    if (id == '1') {
      var checkedVal: any[] = [];
      for (var i = 0; i < this.allnotifications.length; i++) {
        if (this.allnotifications[i].state == true) {
          result = this.allnotifications[i].id;
          checkedVal.push(result);
        }
      }
      this.checkedValGet = checkedVal;
    } else {
      var checkedVal: any[] = [];
      for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].state == true) {
          result = this.messages[i].id;
          checkedVal.push(result);
        }
      }
      console.log(checkedVal)
      this.checkedValGet = checkedVal;
    }
    checkedVal.length > 0 ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
  }

  notificationDelete() {
    if (this.notifyId == '1') {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.allnotifications.length; j++) {
          if (this.allnotifications[j].id == this.checkedValGet[i]) {
            this.allnotifications.splice(j, 1)
          }
        }
      }
    } else {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.messages.length; j++) {
          if (this.messages[j].id == this.checkedValGet[i]) {
            this.messages.splice(j, 1)
          }
        }
      }
    }
    this.calculatenotification()
    this.modalService.dismissAll();
  }

  calculatenotification() {
    this.totalNotify = 0;
    this.checkedValGet = []

    this.checkedValGet.length > 0 ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
    if (this.totalNotify == 0) {
      document.querySelector('.empty-notification-elem')?.classList.remove('d-none')
    }
  }
}
