import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';
import { System } from '../../../shared/models/system.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-errors-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Basic Component
 */
export class BasicComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system: System;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
