// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-top-performers',
    templateUrl: './top-performers.component.html',
    styleUrls: ['./top-performers.component.scss'],
    standalone: false
})

/**
 * Top Perfomers Component
 */
export class TopPerformersComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Top Perfomers
  @Input() TopPerformers: Array<{
    image?: string;
    coinName?: string;
    price?: string;
    change?: string;
    profit?: string;
    balance?: string;
    percentage?: string;
  }> | undefined;

  constructor(private defaultControllerServices: DefaultComponentServices) { }

  ngOnInit(): void {
  }

}
