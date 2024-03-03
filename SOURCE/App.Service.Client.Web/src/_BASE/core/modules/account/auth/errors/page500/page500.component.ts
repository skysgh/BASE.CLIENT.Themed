import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../shared/services/system.service';
import { System } from '../../../../../../shared/models/system.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page500',
  templateUrl: './page500.component.html',
  styleUrls: ['./page500.component.scss']
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
