// Ag:
import { Component, Input, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-scrollbacktotop',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexScrollBackToTopComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }


  ngOnInit(): void {
  }


  // Event handler for window event:
  // tslint:disable-next-line: typedef
  onWindowScroll() {
   
    // Top Btn Set
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block"
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none"
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  onScrollBackToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
