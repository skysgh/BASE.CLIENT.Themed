import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../common/services/system.service';
import { System } from '../../../../../../common/models/system.model';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Logout Basic Component
 */
export class BasicComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService:SystemService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
