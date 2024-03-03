import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../shared/services/system.service';
import { System } from '../../../../../../shared/models/system.model';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
