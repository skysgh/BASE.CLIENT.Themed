// Rx:
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// ✅ UPDATED: Use brochure applet
import { BrochureFaqService } from '../../../../../../../sites.app.lets/brochure/services/brochure-faq.service';
// Models/Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-index-faqs',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesLandingIndexFaqsComponent implements OnInit {
  public groupConfiguration = sitesConfiguration
  public viewModel: ViewModel = new ViewModel();
  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public faqService: BrochureFaqService) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
  }
}
