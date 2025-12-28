// Rx:
import { Observable, of } from "rxjs";
// Ag:
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Etc:
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// Services:
import { ServiceNotificationService } from "../../../../../core/services/service-notification.service";
import { ResourceUrlService } from "../../../../../core/services/resource-url.service";
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
// Modal
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languagenotifications',
  templateUrl: './x.component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarNotificationsComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  messages: any

  checkedValGet: any[] = [];

  // NOtificationService lists:
  // ✅ REMOVED: allnotifications - template uses signal directly
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  notifyId: any;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public notificationService: ServiceNotificationService,
    private resourceUrlService: ResourceUrlService,
    private modalService: NgbModal) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name} initialized - using new polling service`);
  }


  // CHECK:
  @ViewChild('removenotification') removenotification !: TemplateRef<any>;


  ngOnInit(): void {
    // ✅ REMOVED: Stale initialization - template uses signal directly
    // The service automatically polls every 60s and updates the signal
    this.messages = []; // TODO: filter by type when we have message types
    
    this.defaultControllerServices.diagnosticsTraceService.debug(
      `${this.constructor.name} initialized - notifications will update automatically via signal`
    );
  }

  /**
   * Get secure avatar URL using ResourceUrlService
   * @param filename Avatar filename (e.g., 'avatar-1.jpg')
   * @returns Observable<string> - Secure URL for avatar
   */
  getAvatarUrl(filename: string): Observable<string> {
    if (!filename) {
      return of('');
    }
    
    return this.resourceUrlService.getUserAvatarUrl(filename);
  }

  /**
* Open modal
* @param content modal content
*/
  openModal(content: any) {
    // this.submitted = false;
    this.modalService.open(content, { centered: true });
  }


  notificationDelete() {
    // ✅ UPDATED: Use signal instead of stale allnotifications
    const currentNotifications = this.notificationService.enabledNotifications();
    
    if (this.notifyId == '1') {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < currentNotifications.length; j++) {
          if (currentNotifications[j].id == this.checkedValGet[i]) {
            currentNotifications.splice(j, 1)
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


  // Remove Notification
  onCheckboxChange(event: any, id: any) {
    this.notifyId = id
    var result;
    if (id == '1') {
      // ✅ UPDATED: Use signal
      const currentNotifications = this.notificationService.enabledNotifications();
      var checkedVal: any[] = [];
      for (var i = 0; i < currentNotifications.length; i++) {
        // ✅ FIXED: Use 'enabled' property instead of 'state'
        if (currentNotifications[i].enabled == true) {
          result = currentNotifications[i].id;
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
      this.checkedValGet = checkedVal;
    }
    checkedVal.length > 0 ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
  }

}
