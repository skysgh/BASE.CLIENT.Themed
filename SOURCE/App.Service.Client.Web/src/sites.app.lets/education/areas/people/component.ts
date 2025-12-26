// Ag:
import { Component, OnInit } from "@angular/core";
// Configuration:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration';
import { appletsEducationConfiguration } from "../../configuration/implementations/app.lets.education.configuration";
// Services:
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";
// Models/Data:
import { SummaryItemVTO } from "../../../../core/models/SummaryItem.vto.model";
import { ViewModel } from "./vm";

@Component({
  selector: 'app-base-apps-education-people',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationPeopleComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsEducationConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

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

  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

  public showAlert(item:SummaryItemVTO) {
    console.log("AWESOME...");
  }
}
