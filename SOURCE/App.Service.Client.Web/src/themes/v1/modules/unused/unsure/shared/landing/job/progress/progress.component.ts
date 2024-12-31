// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
// 
// Constants:
import { system as importedSystemConst } from '../../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../../core/services/system.service';
import { ViewModel } from './vm';


@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(systemService: SystemService) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
