import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-crypto-stat',
  templateUrl: './crypto-stat.component.html',
  styleUrls: ['./crypto-stat.component.scss']
})

/**
 * Crypto Stat Component 
 */
export class CryptoStatComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;

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
