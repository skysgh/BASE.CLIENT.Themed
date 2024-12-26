import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-best-selling',
  templateUrl: './best-selling.component.html',
  styleUrls: ['./best-selling.component.scss']
})
export class BestSellingComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Best Selling data
  @Input() BestSelling: Array<{
    image?: string;
    pName?: string;
    date?: string;
    price?: string;
    orders?: string;
    stock?: string;
    amount?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
