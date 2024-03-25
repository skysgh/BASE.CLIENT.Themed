import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SystemService } from "../../../../services/system.service";
import { System } from "../../../../constants/contracts/system";
import { EventService } from "../../../../services/event.service";

@Component({
  selector: 'app-frame-context-menuhide',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutTopBarContextMenuHideComponent implements OnInit {

  system: System;

  //mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    systemService: SystemService,
    public translate: TranslateService,
    private eventService: EventService
  ) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

  /**
  * Toggle the menu bar when having mobile screen
  */
  onMobileMenuButtonClicked(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')

    event.preventDefault();
    // Except I don't know where this goes...
    // (it used to be in the parent control until it was cut up into its
    // own child control)
    this.mobileMenuButtonClicked.emit();
  }



}
