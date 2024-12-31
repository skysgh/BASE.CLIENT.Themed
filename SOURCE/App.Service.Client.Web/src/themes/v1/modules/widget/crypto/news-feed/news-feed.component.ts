import { Component, OnInit, Input } from '@angular/core';

import { ViewModel } from './vm';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})

/**
 * News Feed Component
 */
export class NewsFeedComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

   // News Feed
   @Input() NewsFeed: Array<{
    image?: string;
    content?: string;
    date?: string;
    time?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
