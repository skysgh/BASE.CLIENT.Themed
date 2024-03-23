import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// Configuration:
import { System } from '../../../../shared/constants/contracts/system';
// Services:
import { SystemService } from '../../../../shared/services/system.service';

@Component({
  selector: 'app-base-core-errors-500-todo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Page500 Component
 */
export class BaseErrors500TodoComponent implements OnInit {

  system?: System;
  constructor(private systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
