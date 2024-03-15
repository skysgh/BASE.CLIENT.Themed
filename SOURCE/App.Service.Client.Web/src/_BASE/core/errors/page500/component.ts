import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';
import { System } from '../../../shared/constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-errors-page500',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Page500 Component
 */
export class Page500Component implements OnInit {

  system?: System;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
