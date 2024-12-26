// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { SystemService } from '../../../../../../core/services/system.service';
// Models:
import { ServicePricingPlan } from "../../../../../../core/models/data/service-pricing-plan.model";
import { ServicePricingPlansService } from '../../../../../../core/services/services/service-pricingplans.service';
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
 * Index Component
 */
export class BaseCorePagesLandingPricingComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  breadCrumbItems!: Array<{}>;


  public monthlyPlans$: Observable<ServicePricingPlan[]> = of([]);
  public yearlyPlans$: Observable<ServicePricingPlan[]> = of([]);


  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService,
    private servicePricingPlansService: ServicePricingPlansService
  ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Pricing', active: true }
    ];


  }









  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)


    // Chat Data Get Function
    this._fetchData();
  }

  // Chat Data Fetch
  private _fetchData() {
    this.monthlyPlans$ = this.servicePricingPlansService.mappedItems$;
    this.yearlyPlans$ = this.servicePricingPlansService.filteredNotMappedItems$;
  }

}
