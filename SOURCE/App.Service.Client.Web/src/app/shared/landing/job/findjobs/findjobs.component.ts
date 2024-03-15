import { Component, OnInit } from '@angular/core';

// Data Get
import { findjob } from './data';
import { System } from '../../../../../_BASE/shared/constants/contracts/system';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';

@Component({
  selector: 'app-findjobs',
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss']
})
export class FindjobsComponent implements OnInit {

  findjobs: any;
  system: System;

  constructor(systemService: SystemService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
    // Fetch Data
    this.findjobs = findjob
  }

}
