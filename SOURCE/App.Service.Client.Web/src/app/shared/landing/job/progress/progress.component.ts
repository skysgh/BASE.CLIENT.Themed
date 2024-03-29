// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
// 
// Constants:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';
// Services:
import { SystemService } from '../../../../../_BASE/core/services/system.service';


@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  system = importedSystemConst;
  constructor(systemService: SystemService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
