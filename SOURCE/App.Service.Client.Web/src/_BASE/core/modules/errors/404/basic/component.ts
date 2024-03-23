import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//Constants:
import { System } from '../../../../../shared/constants/contracts/system';

//Services:
import { SystemService } from '../../../../../shared/services/system.service';

@Component({
  selector: 'app-base-core-errors-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Basic Component
 */
export class BaseErrors404BasicComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system: System;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
