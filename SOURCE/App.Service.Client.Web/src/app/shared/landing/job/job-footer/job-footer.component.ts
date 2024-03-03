import { Component, OnInit } from '@angular/core';
import { System } from '../../../../../_BASE/shared/models/system.model';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styleUrls: ['./job-footer.component.scss']
})
export class JobFooterComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
