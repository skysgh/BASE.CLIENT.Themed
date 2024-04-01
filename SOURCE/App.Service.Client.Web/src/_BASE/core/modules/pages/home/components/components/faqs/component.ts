// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { SystemFaqsRepositoryService } from '../../../../../../services/repositories/system-faqs.repository.service';
import { Observable, of } from 'rxjs';
import { SystemFaq } from '../../../../../../models/data/systemEndorsement.model';

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
  system = importedSystemConst;

  sectionsInfo = importedSectionsInfo;

  faqs$: Observable<SystemFaq[]> = of([]);

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService,
    private systemFaqsRepositoryService: SystemFaqsRepositoryService) {
//    this.system = systemService.system;
    
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    this.systemFaqsRepositoryService.getPage().subscribe(x => {
      this.faqs$ = of(x);
    });
  }

}
