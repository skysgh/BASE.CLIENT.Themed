import { Component, OnInit } from '@angular/core';
import { System } from '../../../../../../common/models/system.model';
import { SystemService } from '../../../../../../common/services/system.service';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * TwoStep Cover Component
 */
export class CoverComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system: System;

  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(systemService: SystemService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

  /**
   * Confirm Otp Verification
   */
   config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '80px',
      'height': '50px'
    }
  };

}
