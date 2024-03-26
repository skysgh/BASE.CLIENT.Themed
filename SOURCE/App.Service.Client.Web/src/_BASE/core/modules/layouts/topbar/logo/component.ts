import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SystemService } from "../../../../services/system.service";
import { System } from "../../../../constants/contracts/system";

@Component({
  selector: 'app-base-common-components-topbar-languagelogo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarLogoComponent implements OnInit {

  system: System;


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
