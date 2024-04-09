// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';
// Services:
import { SystemService } from '../../../../../_BASE/core/services/system.service';
// Data/Model
import { findjob } from './data';

@Component({
  selector: 'app-findjobs',
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss']
})
export class FindjobsComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

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
