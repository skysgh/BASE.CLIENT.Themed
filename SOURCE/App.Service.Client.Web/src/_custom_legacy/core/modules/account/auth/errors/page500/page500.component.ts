import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../common/services/system.service';
import { System } from '../../../../../../common/models/system.model';

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
  constructor(systemService: SystemService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
