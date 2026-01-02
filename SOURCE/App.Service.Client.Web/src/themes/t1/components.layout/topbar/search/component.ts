// Rx:
//
// Ag:
import { Component, Inject, OnInit, DOCUMENT, inject } from "@angular/core";
import { Router } from "@angular/router";

// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { EventService } from "../../../../../core/services/infrastructure/event.service";
import { SearchContextService } from "../../../../../core/services/search-context.service";
// Models:
import { ViewModel } from "../vm";
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";

@Component({
    selector: 'app-base-common-components-topbar-languagesearch',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarSearchComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // Services
  searchContext = inject(SearchContextService);
  private router = inject(Router);

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor(
    @Inject(DOCUMENT) private document: any,
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService
  ) {}

  ngOnInit(): void {}

  /**
   * Navigate to the search page
   */
  navigateToSearch(): void {
    this.router.navigate(['/apps/search']);
  }
}
