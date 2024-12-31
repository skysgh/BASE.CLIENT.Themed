// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../../core/services/system.service';
// Data/Model
import { findjob } from './data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-findjobs',
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss']
})
export class FindjobsComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  findjobs: any;

  constructor(systemService: SystemService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
    // Fetch Data
    this.findjobs = findjob
  }

}
