import { Component, OnInit } from '@angular/core';
import { System } from '../../../../../_custom/common/models/system.model';
import { SystemService } from '../../../../../_custom/common/services/system.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

/**
 * Footer Component
 */
export class FooterComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
