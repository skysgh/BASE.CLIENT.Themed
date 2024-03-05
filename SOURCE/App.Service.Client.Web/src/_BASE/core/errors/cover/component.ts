import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';
import { System } from '../../../shared/models/system.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-errors-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Cover Component
 */
export class CoverComponent implements OnInit {

  system?: System;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
