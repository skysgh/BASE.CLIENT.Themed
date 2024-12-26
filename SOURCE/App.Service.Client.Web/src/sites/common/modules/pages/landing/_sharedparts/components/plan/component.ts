// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { ServicePricingPlansService } from '../../../../../../../../core/services/services/service-pricingplans.service';
// Models:
import { ServicePricingPlan } from "../../../../../../../../core/models/data/service-pricing-plan.model";
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { error } from 'jquery';
import { ViewModel } from './vm';



@Component({
  selector: 'app-base-core-pages-landing-index-plan',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Plan Component
 */
export class BaseAppsPagesLandingIndexPlanComponent implements OnInit {


  public monthlyPlans$: Observable<ServicePricingPlan[]> = of([]);
  public yearlyPlans$: Observable<ServicePricingPlan[]> = of([]);

  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService,
    private servicePricingPlansService: ServicePricingPlansService
) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    this._fetchData();

  }

  ngOnInit(): void {
    // Chat Data Get Function

    document.querySelectorAll(".annual").forEach((item)=>{
      item.setAttribute('style','display:none')
    })
  }






   // Chat Data Fetch
   private _fetchData() {
     this.monthlyPlans$ = this.servicePricingPlansService.items$;
     this.yearlyPlans$ = this.servicePricingPlansService.filteredNotMappedItems$;
  }

  /**
   * Open modal
   * @param content modal content
   */
   
  public flipView() {
    let checkBox = document.getElementById("plan-switch");
    if (checkBox == null) {
      throw "can't find inputcontrol";
      return;
    }
    var value = (checkBox as HTMLInputElement).checked;

    if (!value) {
      var monthStyle = 'display:block';
      var yearStyle = 'display:none';
    } else {
      var monthStyle = 'display:none';
      var yearStyle = 'display:block';
    }
    var month = document.querySelectorAll(".month");
    var annual = document.querySelectorAll(".annual");

    month.forEach((item) => { item.setAttribute('style', monthStyle); });
    annual.forEach((item) => { item.setAttribute('style', yearStyle); });
    
  }

}
