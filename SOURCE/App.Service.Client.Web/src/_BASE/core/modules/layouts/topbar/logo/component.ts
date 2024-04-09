// Ag:
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from "../../../../services/system.service";

@Component({
  selector: 'app-base-common-components-topbar-languagelogo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarLogoComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;


  constructor(
    systemService: SystemService,
    public translate: TranslateService
  ) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
  }
}
