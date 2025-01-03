// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../../../core/constants/system';
// Services:
//
// Models:
import { StatOneVTO } from '../../../../../../../core/models/view/stat-one.vto';
import { ViewModel } from './vm';

/**
 * Used on dashboard to show a box with current stats in it.
 * Notice how a span is used to isolate just the number,
 * then animation applied. The prefix and suffix are outside this span.
 */
@Component({
  selector: 'app-base-common-components-stats-one',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCommonComponentsStatsOneComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input()
  public stats: StatOneVTO | undefined;

  // Not everything is about money (eg: students, schools, etc.)
  @Input()
  public decimalPlaces: number = 2;


  //Used to drive counting of numbers:
  @Input()
  public statsRenderingOptions : any;
  
  constructor() {
  };


  ngOnInit(): void {
    this.statsRenderingOptions = {
      startVal: 0, //starts at this number and eases into original bound value.
      useEasing: true,
      duration: 1,
      decimalPlaces: this.decimalPlaces,
    }
  }
  
}
