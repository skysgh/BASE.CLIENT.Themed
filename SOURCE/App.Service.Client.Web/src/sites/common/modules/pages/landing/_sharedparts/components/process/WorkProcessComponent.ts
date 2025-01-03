import { Component, OnInit } from '@angular/core';
import { ProcessModel } from './process.model';
import { TranslateService } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { SystemService } from '../../../../../../../../core/services/system.service';


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
        private diagnosticsTraceService: SystemDiagnosticsTraceService,
        public translate: TranslateService) {
      // Make system/env variables avaiable to view template (via const or service):
        // this.system = systemService.system;

        this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
