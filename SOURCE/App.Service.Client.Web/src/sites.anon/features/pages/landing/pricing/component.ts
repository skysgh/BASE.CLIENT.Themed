// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// Configuration:
import { sitesConfiguration } from '../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
// Describe applet (now in sites.app.parts):
import { ServiceDescribePricingPlanService } from '../../../../../sites.app.parts/describe/services/service-describe-pricing-plan.service';
import { ServiceDescribePricingPlanViewModel } from '../../../../../sites.app.parts/describe/models/view-models/service-describe-pricing-plan.view-model';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-pricing',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Pricing Component
 */
export class BaseCorePagesLandingPricingComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  breadCrumbItems!: Array<{}>;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public pricingPlanService: ServiceDescribePricingPlanService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Pricing', active: true }
    ];
  }

  get pricingPlans(): ServiceDescribePricingPlanViewModel[] {
    return this.pricingPlanService.plans();
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
