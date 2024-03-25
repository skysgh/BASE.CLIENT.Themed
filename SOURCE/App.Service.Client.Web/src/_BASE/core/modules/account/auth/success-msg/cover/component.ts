import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../services/system.service';
import { System } from '../../../../../constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-modules-account_auth-success-msg-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
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

  constructor(private systemService: SystemService, public translate: TranslateService) {
    this.system = this.systemService.system;
}

  ngOnInit(): void {
  }

}
