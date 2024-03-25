// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { System } from "../../../../core/constants/contracts/system";
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";
import { SummaryItemVTO } from "../../../../core/models/SummaryItemVTO.model";

@Component({
  selector: 'app-base-apps-education-people',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationPeopleComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  damnit: SummaryItemVTO[] =
    [

{
  id: 1,
  enabled: true,
  typeId: '01',
  type: 'spike',
  typeImage: 'assets/images/types/person.png',
  category: 'unset...',
  title: "titles...",
  description: "foo description",
  more: '',
  values: [

    { title: 'primary', value: '123' },
    { title: 'seondary', value: '456' }
  ],
  operations: []
},
      {
        id: 2,
        enabled: true,
        typeId: '02',
        type: 'spike',
        typeImage: 'assets/images/types/groups.png',
        category: 'unset...',
        title: "titles 2...",
        description: "bar description",
        more: '',
        values: [

          { title: 'primary', value: '123' },
          { title: 'seondary', value: '456' }
        ],
        operations: []
      },

    ];

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

  public showAlert(item:SummaryItemVTO) {
    console.log("AWESOME...");
  }
}
