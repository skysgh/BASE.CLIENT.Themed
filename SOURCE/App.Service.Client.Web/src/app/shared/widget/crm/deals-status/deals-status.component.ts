import { Component, OnInit, Input } from '@angular/core';

import { ViewModel } from './vm';

@Component({
  selector: 'app-deals-status',
  templateUrl: './deals-status.component.html',
  styleUrls: ['./deals-status.component.scss']
})

/**
 * Deals Status Component
 */
export class DealsStatusComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Deals Status
  @Input() DealsStatus: Array<{
    name?: string;
    date?: string;
    profile?: string;
    userName?: string;
    status?: string;
    value?: string;
  }> | undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

}
