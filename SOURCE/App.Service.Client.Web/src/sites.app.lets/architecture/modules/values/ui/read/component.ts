import { Component, OnInit } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { ExampleService } from '../../../../../../core/services/example.service';
import { ArchitectureValuesRepositoryService } from '../../../../services/repositories/values-repository.service';

import { Value } from '../../../../models/value.model';
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { appletsArchitectureConfiguration } from '../../../../configuration/implementations/app.lets.architecture.configuration';


@Component({
  selector: 'app-base-apps-architecture-value-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsArchitectureValuesReadComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsArchitectureConfiguration

  public data? : Value[] = [];

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private repositoryService: ArchitectureValuesRepositoryService,
    ) {

    
    this.defaultControllerServices.diagnosticsTraceService.info("foo");
    //var a = exampleService.someField;
    this.defaultControllerServices.diagnosticsTraceService.info('');

    //this.data : any=[];//[{ title: 'Ebony' }, { title: 'Chiho' }];
  }
  ngOnInit(): void {
    this.repositoryService
      .getPage()
      .subscribe((x:any) => {this.data = x;});
    }

  public DoSomething() {
    this.defaultControllerServices.diagnosticsTraceService.info("blah");
  }
}
