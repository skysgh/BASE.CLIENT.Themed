// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { ProcessModel } from './process.model';

@Component({
    selector: 'app-base-core-pages-landing-index-work-process',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})

/**
 * WorkProcess Component
 */
export class WorkProcessComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

    Process!: ProcessModel[];

  constructor(
        private defaultComponentServices: DefaultComponentServices) {

        this.defaultComponentServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
