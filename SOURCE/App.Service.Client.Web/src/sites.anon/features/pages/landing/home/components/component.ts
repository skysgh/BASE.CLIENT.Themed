// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from '../vm';
// Data:
import { sectionsInfo as importedSectionsInfo } from './sectionsInfo.data';

@Component({
  selector: 'app-apps-home-home',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsPagesHomeIndexComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  sectionId: string ='';

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  sectionsInfo = importedSectionsInfo;


  constructor(
    protected defaultControllerServices: DefaultComponentServices) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Home', active: true }
    ];
  }



  // Event handler for child event raised:
  // which wil be the outer div that has
  // appScrollspy behaviour that has been
  // added.
  onSectionChanged(sectionId: any) {
    this.sectionId = sectionId;
    // changes to this property
    // are pushed to the child header's
    // @input.
  }


}
