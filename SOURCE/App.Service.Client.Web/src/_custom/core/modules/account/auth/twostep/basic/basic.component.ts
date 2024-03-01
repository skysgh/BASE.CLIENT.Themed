import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../common/services/system.service';
import { System } from '../../../../../../common/models/system.model';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Two Step Basic Component
 */
export class BasicComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();

  public system?: System;

  constructor(private systemService: SystemService) {
    this.system = this.systemService.system;
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
