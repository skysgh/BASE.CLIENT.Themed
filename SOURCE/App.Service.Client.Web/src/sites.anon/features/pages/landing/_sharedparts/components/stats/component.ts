// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Brochure Applet:
import { BrochureStatsService } from '../../../../../../../sites.app.lets/brochure/services/brochure-stats.service';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-stats',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesLandingIndexStatsComponent implements OnInit {
  public groupConfiguration = sitesConfiguration;
  public viewModel: ViewModel = new ViewModel();
  sectionsInfo = importedSectionsInfo;

  private C_START_NUMBER: number = 0;
  public option = {
    startVal: this.C_START_NUMBER,
    decimalPlaces: 2,
    duration: 2,
    useEasing: true
  };

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public statsService: BrochureStatsService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    // Stats automatically loaded by service
    // Access via statsService.enabledStats() signal
  }
}
