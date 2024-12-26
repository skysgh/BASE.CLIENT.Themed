// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
// Models:
//import { ClientLogo } from './data';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ServiceTrustedByService } from '../../../../../../../../core/services/service.trusted-by.service';
import { ServiceTrustedByVTO } from '../../../../../../../../core/models/view/service.trusted-by.vto.model';
import { Observable, of } from 'rxjs';

import {  Responsive as importedResponsive} from './settings';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-client-logo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ClientLogoComponent
 */
export class BaseAppsPagesLandingIndexClientsComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;
  // Configuration for ngx-slick-carousel:
  carouselConfiguration = importedResponsive;

  // Define an observable:
  public list$: Observable<ServiceTrustedByVTO[]> = of([]);

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService,
    private serviceTrustedByService: ServiceTrustedByService
  ) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    this.initList();
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }



  
  private initList() {
    
    this.serviceTrustedByService 
      .items$
      .subscribe(list => {
        if (list.length == 0) {
          this.diagnosticsTraceService.warn("...early exit...");
          return;
        }
        this.list$ = of(list)
      });
  }



}
