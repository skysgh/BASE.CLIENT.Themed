import { Component, OnInit } from '@angular/core';
import { ProcessModel } from './process.model';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';
import { SystemService } from '../../../../../../services/system.service';


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
      // Make system/env variables avaiable to view template (via const or service):
        // this.system = systemService.system;

        this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
