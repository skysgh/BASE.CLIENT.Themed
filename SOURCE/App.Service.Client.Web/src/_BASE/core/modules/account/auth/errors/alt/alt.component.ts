import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../shared/services/system.service';
import { System } from '../../../../../../shared/models/system.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alt',
  templateUrl: './alt.component.html',
  styleUrls: ['./alt.component.scss']
})

/**
 * 404 Alt Component
 */
export class AltComponent implements OnInit {

  system?: System;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
