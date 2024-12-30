import { Component, OnInit, Input } from '@angular/core';

import { ViewModel } from './vm';

@Component({
  selector: 'app-top-pages',
  templateUrl: './top-pages.component.html',
  styleUrls: ['./top-pages.component.scss']
})

/**
 * Top Pages Component
 */
export class TopPagesComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Top Selling data
  @Input() TopPages: Array<{
    page?: string;
    active?: string;
    users?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
