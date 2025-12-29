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
// ✅ UPDATED: Use brochure applet service
import { BrochurePricingPlanService } from '../../../../../sites.app.lets/brochure/services/brochure-pricing-plan.service';
import { BrochurePricingPlanViewModel } from '../../../../../sites.app.lets/brochure/models/view-models/brochure-pricing-plan.view-model';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-pricing',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Pricing Component
 * 
 * ✅ UPDATED - Uses Brochure App.let
 */
export class BaseCorePagesLandingPricingComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  breadCrumbItems!: Array<{}>;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    // ✅ UPDATED: Use brochure applet service
    public pricingPlanService: BrochurePricingPlanService
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

  // ✅ Get pricing plans from signal-based service
  get pricingPlans(): BrochurePricingPlanViewModel[] {
    return this.pricingPlanService.plans();
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
    // Pricing plans load automatically in service constructor
  }
}
