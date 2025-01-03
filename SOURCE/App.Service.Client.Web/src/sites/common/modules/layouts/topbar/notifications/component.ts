// Ag:
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Etc:
import { Observable, of } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Services:
import { SystemService } from "../../../../../../core/services/system.service";
import { ServiceNotification } from "../../../../../../core/models/data/service-notification.model";
import { ServiceNotificationsService } from "../../../../../../core/services/service.notification.service";
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languagenotifications',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarNotificationsComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  messages: any

  checkedValGet: any[] = [];

  // NOtificationService lists:
  allnotifications: any
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  notifyId: any;


  public notificationsAll$: Observable<ServiceNotification[]> = of([]);
  public notificationsMessages$: Observable<ServiceNotification[]> = of([]);
  public notificationsAlerts$: Observable<ServiceNotification[]> = of([]);

  constructor(
    systemService: SystemService,
    public translate: TranslateService,
    private serviceNotificationsService: ServiceNotificationsService,
    private modalService: NgbModal) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }


  // CHECK:
  @ViewChild('removenotification') removenotification !: TemplateRef<any>;


  ngOnInit(): void {
    this.initMessages();
  }

  private initMessages() {
    this.serviceNotificationsService
      .mappedItems$
      .subscribe(x => {
        // Fetch Data
        this.notificationsAll$ = of(x);
      });

    this.serviceNotificationsService
      .filteredMappedItems$
      .subscribe(x => {
        // Fetch Data
        this.notificationsMessages$ = of(x);
      });
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


  // Remove Notification
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
      this.checkedValGet = checkedVal;
    }
    checkedVal.length > 0 ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
  }

}
