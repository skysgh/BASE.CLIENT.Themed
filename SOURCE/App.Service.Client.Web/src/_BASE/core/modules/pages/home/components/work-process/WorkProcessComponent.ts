import { Component, OnInit } from '@angular/core';
import { ProcessModel } from './process.model';
import { SystemService } from '../../../../../../shared/services/system.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-base-core-pages-landing-index-work-process',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})

/**
 * WorkProcess Component
 */
export class WorkProcessComponent implements OnInit {

    Process!: ProcessModel[];

    constructor(systemService: SystemService,
        private diagnosticsTraceService: DiagnosticsTraceService,
        public translate: TranslateService) {
        this.system = systemService.system;

        this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }
}
