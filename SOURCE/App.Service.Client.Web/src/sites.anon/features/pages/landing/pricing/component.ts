// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// Configuration:
import { sitesConfiguration } from '../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
// Models:
import { ServicePricingPlan } from "../../../../../core/models/data/service-pricing-plan.model";
import { ServicePricingPlansService } from '../../../../../core/services/services/service-pricingplans.service';
import { Observable, of } from 'rxjs';  
import { ViewModel } from './vm';
// Data:
//import { MonthlyPlan, YearlyPlan } from '../../../../data/fake/pricing.data';


@Component({
  selector: 'app-base-core-pages-landing-pricing',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Pricing Component
 * 
 * ✅ ARCHITECTURAL FIX - Removed Upward Coupling
 * Removed direct appsConfiguration import (upward coupling to Apps tier)
 * Component now only references sitesConfiguration (same tier)
 */
export class BaseCorePagesLandingPricingComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  breadCrumbItems!: Array<{}>;


  public monthlyPlans$: Observable<ServicePricingPlan[]> = of([]);
  public yearlyPlans$: Observable<ServicePricingPlan[]> = of([]);


  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private servicePricingPlansService: ServicePricingPlansService
  ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Pricing', active: true }
    ];


  }









  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)


    // Chat Data Get Function
    this._fetchData();
  }

  // Chat Data Fetch
  private _fetchData() {
    this.monthlyPlans$ = this.servicePricingPlansService.mappedItems$;
    this.yearlyPlans$ = this.servicePricingPlansService.filteredNotMappedItems$;
  }

}
