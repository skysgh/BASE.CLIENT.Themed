// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;

  constructor() {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
