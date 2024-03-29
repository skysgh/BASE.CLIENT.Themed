// Ag:
import { Component, Input, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-landing-index-scrollbacktotop',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexScrollBackToTopComponent implements OnInit {

  system = importedSystemConst;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
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
