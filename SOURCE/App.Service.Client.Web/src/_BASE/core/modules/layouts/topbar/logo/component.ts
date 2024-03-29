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

  system = importedSystemConst;


  constructor(
    systemService: SystemService,
    public translate: TranslateService
  ) {
    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }
}
