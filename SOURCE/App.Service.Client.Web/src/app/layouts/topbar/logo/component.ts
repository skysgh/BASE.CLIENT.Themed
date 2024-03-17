import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SystemService } from "../../../../_BASE/shared/services/system.service";
import { System } from "../../../../_BASE/shared/constants/contracts/system";

@Component({
  selector: 'app-frame-context-logo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutTopBarContextLogoComponent implements OnInit {

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
