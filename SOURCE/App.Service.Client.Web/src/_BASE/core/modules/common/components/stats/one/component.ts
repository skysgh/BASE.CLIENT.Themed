import { Component, OnInit, Input } from '@angular/core';
import { StatOneVTO } from '../../../../../models/view/stat-on.vto';

/**
 * Used on dashboard to show a box with current stats in it.
 */
@Component({
  selector: 'app-base-common-components-stats-one',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCommonComponentsStatsOneComponent implements OnInit {

  @Input()
  public stats: StatOneVTO | undefined;

  //Used to drive counting of numbers:
  public statsRenderingOptions : any;
  
  constructor() {
  };


  ngOnInit(): void {
    this.statsRenderingOptions = {
      startVal: this.stats?.value || 0,
      useEasing: true,
      duration: 2,
      decimalPlaces: 2,
    }
  }
  
}
