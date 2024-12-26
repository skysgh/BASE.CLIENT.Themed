import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html',
  styleUrls: ['./top-selling.component.scss']
})
export class TopSellingComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Top Selling data
  @Input() TopSelling: Array<{
    image?: string;
    pName?: string;
    subtitle?: string;
    type?: string;
    stock?: string;
    amount?: string;
    percentage?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
