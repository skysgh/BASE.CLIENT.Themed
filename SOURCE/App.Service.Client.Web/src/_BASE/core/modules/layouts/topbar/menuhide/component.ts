// Ag:
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from "../../../../services/system.service";
import { EventService } from "../../../../services/event.service";

@Component({
  selector: 'app-base-common-components-topbar-languagemenuhide',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarMenuHideComponent implements OnInit {

  system = importedSystemConst;

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
