// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceFaqsRepositoryService } from '../../../../../../../core/services/services/repositories/service-faqs.repository.service';
// Models/Data:
import { ServiceFaq } from '../../../../../../../core/models/data/service-faq.model';
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-index-faqs',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Faqs Component
 * 
 * ✅ ARCHITECTURAL FIX - Removed Upward Coupling
 * Removed direct appsConfiguration import (upward coupling to Apps tier)
 * Component now only references sitesConfiguration (same tier)
 */
export class BaseAppsPagesLandingIndexFaqsComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  sectionsInfo = importedSectionsInfo;

  faqs$: Observable<ServiceFaq[]> = of([]);

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private serviceFaqsRepositoryService: ServiceFaqsRepositoryService) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    this.serviceFaqsRepositoryService.getPage().subscribe(x => {
      this.faqs$ = of(x);
    });
  }

}
