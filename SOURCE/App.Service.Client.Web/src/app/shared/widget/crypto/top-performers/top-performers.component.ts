import { Component, OnInit, Input } from '@angular/core';
import { ViewModel } from './vm';

@Component({
  selector: 'app-top-performers',
  templateUrl: './top-performers.component.html',
  styleUrls: ['./top-performers.component.scss']
})

/**
 * Top Perfomers Component
 */
export class TopPerformersComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Top Perfomers
  @Input() TopPerformers: Array<{
    image?: string;
    coinName?: string;
    price?: string;
    change?: string;
    profit?: string;
    balance?: string;
    percentage?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
