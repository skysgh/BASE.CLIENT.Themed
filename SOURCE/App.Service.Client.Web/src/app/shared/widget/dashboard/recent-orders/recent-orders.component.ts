import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../_BASE/core/modules/common/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss']
})
export class RecentOrdersComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

   // Recent Orders data
   @Input() RecentSelling: Array<{
    id?: string;
    image?: string;
    customer?: string;
    product?: string;
    amount?: string;
    vendor?: string;
    status?: string;
    rating?: string;
    average?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
