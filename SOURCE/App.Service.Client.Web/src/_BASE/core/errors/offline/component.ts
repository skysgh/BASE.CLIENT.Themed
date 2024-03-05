import { Component, OnInit } from '@angular/core';
import { System } from '../../../shared/models/system.model';
import { SystemService } from '../../../shared/services/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-errors-offline',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Offline Component
 */
export class OfflineComponent implements OnInit {

  system?: System;
  constructor(systemService: SystemService,
          public translate: TranslateService) {

    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
