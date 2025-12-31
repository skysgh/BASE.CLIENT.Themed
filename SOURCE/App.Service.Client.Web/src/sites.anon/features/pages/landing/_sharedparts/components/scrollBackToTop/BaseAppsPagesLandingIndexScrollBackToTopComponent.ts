import { Component, OnInit } from '@angular/core';
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { TranslationService } from '../../../../../../../core/services/translation.service';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';


@Component({
    selector: 'app-base-core-pages-landing-index-scrollbacktotop',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexScrollBackToTopComponent implements OnInit {
    // Expose system configuration:
    public appsConfiguration = appsConfiguration;
    // Expose parent configuration:
    public groupConfiguration = sitesConfiguration;

    // This controller's ViewModel:
    public viewModel: ViewModel = new ViewModel();
    // TODO: Move these variables into it.
    sectionsInfo = importedSectionsInfo;

    constructor(
        private diagnosticsTraceService: SystemDiagnosticsTraceService,
      public translationService: TranslationService) {
        // Make system/env variables avaiable to view template:

        this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }


    ngOnInit(): void {
    }


    // Event handler for window event:
    // tslint:disable-next-line: typedef
    onWindowScroll() {

        // Top Btn Set
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
        } else {
            (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    onScrollBackToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

}
