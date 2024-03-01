import { Component, OnInit } from '@angular/core';

// Data Get
import { findjob } from './data';
import { System } from '../../../../../_custom/common/models/system.model';
import { SystemService } from '../../../../../_custom/common/services/system.service';

@Component({
  selector: 'app-findjobs',
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss']
})
export class FindjobsComponent implements OnInit {

  findjobs: any;
  system: System;

  constructor(systemService: SystemService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
    // Fetch Data
    this.findjobs = findjob
  }

}
