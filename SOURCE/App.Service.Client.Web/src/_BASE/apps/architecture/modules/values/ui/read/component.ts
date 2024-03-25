import { Component, OnInit } from '@angular/core';
import { DiagnosticsTraceService } from '../../../../../../core/services/diagnostics.service';
import { ExampleService } from '../../../../../../core/services/example.service';
import { ArchitectureValuesRepositoryService } from '../../../../services/repositories/values-repository.service';

import { Value } from '../../../../models/value.model';


@Component({
  selector: 'app-base-apps-architecture-value-read',
  templateUrl: './spike-read.component.html',
  styleUrls: ['./spike-read.component.scss']
})

export class BaseAppsArchitectureValuesReadComponent implements OnInit {

  public data? : Value[] = [];

  constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
    private exampleService: ExampleService,
    private repositoryService: ArchitectureValuesRepositoryService,
    ) {

    
    this.diagnosticsTraceService.info("foo");
    var a = exampleService.someField;
    this.diagnosticsTraceService.info(a);

    //this.data : any=[];//[{ title: 'Ebony' }, { title: 'Chiho' }];
  }
  ngOnInit(): void {
    this.repositoryService
      .getPage()
      .subscribe((x:any) => {this.data = x;});
    }

  public DoSomething() {
    this.diagnosticsTraceService.info("blah");
  }
}
