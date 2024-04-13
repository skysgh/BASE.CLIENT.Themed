// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../core/constants/system';
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../core/services/system.diagnostics-trace.service";
// Models/Data:
import { SummaryItemVTO } from "../../../../core/models/SummaryItem.vto.model";

@Component({
  selector: 'app-base-apps-education-people',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationPeopleComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  damnit: SummaryItemVTO[] =
    [

{
        id: '00000000-0000-0000-0000-000000000001',
  enabled: true,
        typeId: '00000000-0000-0000-0000-000000000001',
  type: 'spike',
  typeImage: '//assets/_BASE/public/dynamic/userdata/images/recordtypes/person.png',
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
        id: '00000000-0000-0000-0000-000000000002',
        enabled: true,
        typeId: '00000000-0000-0000-0000-000000000002',
        type: 'spike',
        typeImage: '//assets/_BASE/public/dynamic/userdata/images/recordtypes/groups.png',
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

  constructor(systemService: SystemService, private diagnosticsTraceService: SystemDiagnosticsTraceService, translateService: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

  public showAlert(item:SummaryItemVTO) {
    console.log("AWESOME...");
  }
}
