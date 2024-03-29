// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
//Services:
import { SystemService } from '../../../../services/system.service';

@Component({
  selector: 'app-base-core-errors-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Basic Component
 */
export class BaseErrors404BasicComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system = importedSystemConst;
  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
