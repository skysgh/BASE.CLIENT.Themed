import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../services/system.service';
import { System } from '../../../../constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-errors-alt',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Alt Component
 */
export class BaseErrors404AltComponent implements OnInit {

  system?: System;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
