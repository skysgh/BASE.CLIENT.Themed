// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';
import { ViewModel } from './vm';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  constructor() {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
