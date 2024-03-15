import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';

import { System } from '../../../../../_BASE/shared/constants/contracts/system';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  system: System;
  constructor(systemService: SystemService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
