// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { ServiceFaqsRepositoryService } from '../../../../../../../../core/services/services/repositories/service-faqs.repository.service';
// Models:
import { ServiceFaq } from '../../../../../../../../core/models/data/service-faq.model';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-index-faqs',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Faqs Component
 */
export class BaseAppsPagesLandingIndexFaqsComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  sectionsInfo = importedSectionsInfo;

  faqs$: Observable<ServiceFaq[]> = of([]);

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService,
    private serviceFaqsRepositoryService: ServiceFaqsRepositoryService) {
//    this.system = systemService.system;
    
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    this.serviceFaqsRepositoryService.getPage().subscribe(x => {
      this.faqs$ = of(x);
    });
  }

}
