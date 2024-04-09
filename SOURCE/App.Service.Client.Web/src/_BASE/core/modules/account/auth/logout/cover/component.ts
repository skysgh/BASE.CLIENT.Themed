// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';


@Component({
  selector: 'app-base-core-modules-account_auth-logout-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Logout Cover Component
 */
export class CoverComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
