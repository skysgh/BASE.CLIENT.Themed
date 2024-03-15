import { Component, OnInit } from '@angular/core';

import {creatorModel} from './top-creator.model';
import { creatorData } from './data';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';
import { System } from '../../../../../_BASE/shared/constants/contracts/system';

@Component({
  selector: 'app-top-creator',
  templateUrl: './top-creator.component.html',
  styleUrls: ['./top-creator.component.scss']
})

/**
 * TopCreator Component
 */
export class TopCreatorComponent implements OnInit {

  creatorData!: creatorModel[];

  system: System;
  constructor(systemService: SystemService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
}

  ngOnInit(): void {
    this.creatorData = creatorData;
  }

}
