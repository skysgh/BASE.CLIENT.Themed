import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../_BASE/core/modules/common/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})

/**
 * Currencies Component
 */
export class CurrenciesComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

   // Currencies data
   @Input() Currencies: Array<{
    image?: string;
    coinName?: string;
    price?: string;
    change?: string;
    profit?: string;
    balance?: string;
    coin?: string;

  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
