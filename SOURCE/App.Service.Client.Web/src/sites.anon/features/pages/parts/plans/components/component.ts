// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
//import { YearlyPlanModel } from '../../../../../../../core/models/data/yearly-plan.model';
import { ServicePricingPlan } from '../../../../../../core/models/data/service-pricing-plan.model';
// Data:
import { MonthlyPlan, YearlyPlan } from '../../../../../../core/data/fake/pricing.data';


@Component({
  selector: 'app-base-core-pages-landing-pricing',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Index Component
 */
export class BaseCorePagesLandingPricingComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  breadCrumbItems!: Array<{}>;
  MonthlyPlan!: ServicePricingPlan[];
  YearlyPlan!: YearlyPlanModel[];


  constructor(
    private defaultControllerServices: DefaultComponentServices) {
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
    this.MonthlyPlan = MonthlyPlan;
    this.YearlyPlan = YearlyPlan;
  }

}
