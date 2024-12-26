import { Component, OnInit, Input } from '@angular/core';

import { ViewModel } from './vm';

@Component({
  selector: 'app-closing-deals',
  templateUrl: './closing-deals.component.html',
  styleUrls: ['./closing-deals.component.scss']
})

/**
 * Closing Deals Component
 */
export class ClosingDealsComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  // Closing Deals
  @Input() ClosingDeals: Array<{
    name?: string;
    profile?: string;
    userName?: string;
    amount?: string;
    date?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
