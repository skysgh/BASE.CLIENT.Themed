// Rx:
import { Observable, of } from "rxjs";
// Ag:
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Etc:
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// Services:
// Operate Applet (now in sites.app.parts):
import { ServiceOperateNotificationService } from "../../../../../sites.app.parts/operate/services/service-operate-notification.service";
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
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;
  public viewModel: ViewModel = new ViewModel();

  messages: any;
  checkedValGet: any[] = [];
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  notifyId: any;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public notificationService: ServiceOperateNotificationService,
    private resourceUrlService: ResourceUrlService,
    private modalService: NgbModal
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name} initialized`);
  }

  @ViewChild('removenotification') removenotification!: TemplateRef<any>;

  ngOnInit(): void {
    this.messages = [];
    this.defaultControllerServices.diagnosticsTraceService.debug(
      `${this.constructor.name} initialized - notifications update via signal`
    );
  }

  getAvatarUrl(filename: string): Observable<string> {
    if (!filename) {
      return of('');
    }
    return this.resourceUrlService.getUserAvatarUrl(filename);
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  notificationDelete() {
    const currentNotifications = this.notificationService.unreadNotifications();
    
    if (this.notifyId == '1') {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < currentNotifications.length; j++) {
          if (currentNotifications[j].id == this.checkedValGet[i]) {
            currentNotifications.splice(j, 1);
          }
        }
      }
    } else {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.messages.length; j++) {
          if (this.messages[j].id == this.checkedValGet[i]) {
            this.messages.splice(j, 1);
          }
        }
      }
    }
    this.calculatenotification();
    this.modalService.dismissAll();
  }

  calculatenotification() {
    this.totalNotify = 0;
    this.checkedValGet = [];

    this.checkedValGet.length > 0 
      ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' 
      : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
    if (this.totalNotify == 0) {
      document.querySelector('.empty-notification-elem')?.classList.remove('d-none');
    }
  }

  onCheckboxChange(event: any, id: any) {
    this.notifyId = id;
    var result;
    if (id == '1') {
      const currentNotifications = this.notificationService.unreadNotifications();
      var checkedVal: any[] = [];
      for (var i = 0; i < currentNotifications.length; i++) {
        checkedVal.push(currentNotifications[i].id);
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
    checkedVal.length > 0 
      ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' 
      : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
  }
}
