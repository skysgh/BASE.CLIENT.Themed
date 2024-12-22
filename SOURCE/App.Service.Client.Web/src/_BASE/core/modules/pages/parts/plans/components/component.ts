// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';
import { SystemService } from '../../../../../services/system.service';
// Models:
import { YearlyPlanModel } from "src/_BASE/core/models/YearlyPlanModel";
import { ServicePricingPlan } from "src/_BASE/core/models/data/service-pricing-plan.model";
// Data:
import { MonthlyPlan, YearlyPlan } from '../../../../../data/fake/pricing.data';


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

  breadCrumbItems!: Array<{}>;
  MonthlyPlan!: ServicePricingPlan[];
  YearlyPlan!: YearlyPlanModel[];


  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
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
    this.MonthlyPlan = MonthlyPlan;
    this.YearlyPlan = YearlyPlan;
  }

}
