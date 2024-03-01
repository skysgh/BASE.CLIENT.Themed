import { Component, OnInit } from '@angular/core';
import { System } from '../../../../../../common/models/system.model';
import { SystemService } from '../../../../../../common/services/system.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})

/**
 * Offline Component
 */
export class OfflineComponent implements OnInit {

  system?: System;
  constructor(systemService: SystemService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
