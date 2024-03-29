// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Const:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';
// Services:
import { SystemService } from '../../../../../_BASE/core/services/system.service';

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styleUrls: ['./job-footer.component.scss']
})
export class JobBaseLayoutFooterComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  system = importedSystemConst;

  constructor(systemService: SystemService, public translate: TranslateService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
