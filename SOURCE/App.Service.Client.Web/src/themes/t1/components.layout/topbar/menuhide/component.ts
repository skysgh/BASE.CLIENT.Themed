// Ag:
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
import { EventService } from "../../../../../core/services/infrastructure/event.service";
// Models:
import { ViewModel } from "../vm";

@Component({
    selector: 'app-base-common-components-topbar-languagemenuhide',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarMenuHideComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  //mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  /**
   * 
   * @param defaultControllerServices
   * @param eventService
   */
  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService
  ) {
    // Make system/env variables avaiable to view template (via const or service):
    
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
