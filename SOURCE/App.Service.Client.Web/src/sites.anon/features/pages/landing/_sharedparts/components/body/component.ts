// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-body',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexBodyComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  @Input() currentSection: string='home';
  @Output() sectionChange = new EventEmitter<string>();


  constructor(
    private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via const or service):
    

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }


  ngOnInit(): void {
  }

  // Method to emit section change event
  emitSectionChange(section: string) {
    this.sectionChange.emit(section);
  }
}
