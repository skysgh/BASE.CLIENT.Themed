import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../common/services/system.service';
import { System } from '../../../../../../common/models/system.model';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * Logout Cover Component
 */
export class CoverComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system?: System;

  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(systemService:SystemService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
