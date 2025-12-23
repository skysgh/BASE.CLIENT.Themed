// Rx:
// 
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Configurations:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-errors-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Cover Component
 */
export class BaseErrors404CoverComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(private defaultComponentService: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via const or service):
    
  }

  ngOnInit(): void {
  }

}
