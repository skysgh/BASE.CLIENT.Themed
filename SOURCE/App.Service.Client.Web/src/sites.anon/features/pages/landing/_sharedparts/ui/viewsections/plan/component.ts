// Rx:
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
// ✅ FIXED: Paths adjusted for new location (_sharedparts/ui/viewsections/plan/)
import { appsConfiguration } from '../../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Describe applet (now in sites.app.parts):
import { ServiceDescribePricingPlanService } from '../../../../../../../../sites.app.parts/describe/services/service-describe-pricing-plan.service';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';



@Component({
    selector: 'app-base-core-pages-landing-index-plan',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Plan Component
 */
export class BaseAppsPagesLandingIndexPlanComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices : DefaultComponentServices,
    public pricingPlanService: ServiceDescribePricingPlanService
) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }

  ngOnInit(): void {
    // Chat Data Get Function

    document.querySelectorAll(".annual").forEach((item)=>{
      item.setAttribute('style','display:none')
    })
  }

  public flipView() {
    let checkBox = document.getElementById("plan-switch");
    if (checkBox == null) {
      throw "can't find inputcontrol";
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
