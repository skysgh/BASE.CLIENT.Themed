import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-crm-stat',
  templateUrl: './crm-stat.component.html',
  styleUrls: ['./crm-stat.component.scss']
})

/**
 * Crm Stat Component
 */
export class CrmStatComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() profit: string | undefined;
  @Input() sign: string | undefined;
  @Input() percentage: string | undefined;
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
