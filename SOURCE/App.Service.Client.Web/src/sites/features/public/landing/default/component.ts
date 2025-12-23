// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

//import { SpikeSpikesRepositoryService } from '../../../../../../core/services/spike-repository.service';
// Models:
//import { Spike } from '../../../../models/spike.model';
//import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-custom-public-landing-Default',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class AppPublicLandingDefaultComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private defaultControllerServices: DefaultComponentServices) {

  }

  ngOnInit(): void {
    }
}
