// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
// ✅ UPDATED: Use brochure view model
import { BrochureStatsViewModel } from '../../../../../sites.app.lets/brochure/models/view-models/brochure-stats.view-model';
import { ViewModel } from './vm';

/**
 * Used on dashboard to show a box with current stats in it.
 */
@Component({
  selector: 'app-base-common-components-stats-one',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCommonComponentsStatsOneComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;
  public viewModel: ViewModel = new ViewModel();

  @Input()
  public stats: BrochureStatsViewModel | undefined;

  @Input()
  public decimalPlaces: number = 2;

  @Input()
  public statsRenderingOptions: any;
  
  constructor(private defaultControllerServices: DefaultComponentServices) {
  }

  ngOnInit(): void {
    this.statsRenderingOptions = {
      startVal: 0,
      useEasing: true,
      duration: 1,
      decimalPlaces: this.decimalPlaces,
    }
  }
}
