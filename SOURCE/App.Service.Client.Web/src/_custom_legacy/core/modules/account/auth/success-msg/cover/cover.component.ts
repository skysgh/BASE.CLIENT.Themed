import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../common/services/system.service';
import { System } from '../../../../../../common/models/system.model';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * Success Msg Cover Component
 */
export class CoverComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  system: System;

  constructor(private systemService: SystemService) {
    this.system = this.systemService.system;
}

  ngOnInit(): void {
  }

}
