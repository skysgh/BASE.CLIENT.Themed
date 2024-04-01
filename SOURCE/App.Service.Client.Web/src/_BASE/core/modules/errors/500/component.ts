// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { SystemService } from '../../../services/system.service';

@Component({
  selector: 'app-base-core-errors-500-todo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Page500 Component
 */
export class BaseErrors500TodoComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;
  constructor(private systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
