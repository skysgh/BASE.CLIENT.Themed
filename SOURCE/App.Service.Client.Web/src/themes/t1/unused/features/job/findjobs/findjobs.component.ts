// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Model
import { ViewModel } from './vm';
// Data:
import { findjob } from './data';

@Component({
  selector: 'app-findjobs',
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss']
})
export class FindjobsComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  findjobs: any;

  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):
    
  }

  ngOnInit(): void {
    // Fetch Data
    this.findjobs = findjob
  }

}
