// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from '../../../../services/system.service';

@Component({
  selector: 'app-base-core-errors-alt',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Alt Component
 */
export class BaseErrors404AltComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;
  constructor(systemService: SystemService, public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

}
