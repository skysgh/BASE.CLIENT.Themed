// Ag:
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from "../../../../../../core/services/system.service";
import { EventService } from "../../../../../../core/services/infrastructure/event.service";
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languagemenuhide',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarMenuHideComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  //mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    systemService: SystemService,
    public translate: TranslateService,
    private eventService: EventService
  ) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
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
