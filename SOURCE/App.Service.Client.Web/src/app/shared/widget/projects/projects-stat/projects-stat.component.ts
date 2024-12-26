import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-projects-stat',
  templateUrl: './projects-stat.component.html',
  styleUrls: ['./projects-stat.component.scss']
})

/**
 * Projects Stat Component
 */
export class ProjectsStatComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;
  @Input() month: string | undefined;

  constructor() { }

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
