// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';
import { SystemService } from '../../../../services/system.service';
// Models:
import { MonthlyPlanModel, YearlyPlanModel } from '../../../../models/pricing.models';
import { MonthlyPlan, YearlyPlan } from '../../../../data/fake/pricing.data';


@Component({
  selector: 'app-base-core-pages-landing-pricing',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Index Component
 */
export class BaseCorePagesLandingPricingComponent implements OnInit {

  system = importedSystemConst;

  breadCrumbItems!: Array<{}>;
  MonthlyPlan!: MonthlyPlanModel[];
  YearlyPlan!: YearlyPlanModel[];


  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
    this.system = systemService.system;

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
