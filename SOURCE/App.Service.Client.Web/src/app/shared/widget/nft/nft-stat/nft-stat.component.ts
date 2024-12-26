import { Component, OnInit, Input } from '@angular/core';

import { ViewModel } from './vm';

@Component({
  selector: 'app-nft-stat',
  templateUrl: './nft-stat.component.html',
  styleUrls: ['./nft-stat.component.scss']
})

/**
 * Nft-Stat Component
 */
export class NftStatComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;
  @Input() bg_color: string | undefined;

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
