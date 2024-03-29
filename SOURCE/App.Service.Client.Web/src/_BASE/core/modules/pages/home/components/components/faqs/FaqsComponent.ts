import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';


@Component({
    selector: 'app-base-core-pages-landing-index-faqs',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})

/**
 * Faqs Component
 */
export class FaqsComponent implements OnInit {

    constructor(systemService: SystemService,
        private diagnosticsTraceService: DiagnosticsTraceService,
        public translate: TranslateService) {
        this.system = systemService.system;

        this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
