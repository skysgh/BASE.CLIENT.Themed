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

  findjobs: any;
  system = importedSystemConst;

  constructor(systemService: SystemService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
    // Fetch Data
    this.findjobs = findjob
  }

}
