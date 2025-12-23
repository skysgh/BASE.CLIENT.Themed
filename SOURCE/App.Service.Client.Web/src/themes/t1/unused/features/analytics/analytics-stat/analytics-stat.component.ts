// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';


@Component({
  selector: 'app-Analytics-stat',
  templateUrl: './analytics-stat.component.html',
  styleUrls: ['./analytics-stat.component.scss']
})

/**
 * Analytics stat Component
 */
export class AnalyticsStatComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;

  constructor(private defaultControllerServices: DefaultComponentServices) { }

  ngOnInit(): void {
  }

  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

}
