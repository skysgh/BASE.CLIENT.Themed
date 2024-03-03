import { Component, OnInit } from '@angular/core';
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { ExampleService } from '../../../../../../common/services/example.service';
import { ArchitectureValuesRepositoryService } from '../../../../services/values-repository.service';

import { Value } from '../../../../models/value.model';


@Component({
  selector: 'app-apps-architecture-value-read',
  templateUrl: './spike-read.component.html',
  styleUrls: ['./spike-read.component.scss']
})

export class ArchitectureValuesReadComponent implements OnInit {

  public data? : Value[] = [];

  constructor(
    private diagnosticsService: DiagnosticsService,
    private exampleService: ExampleService,
    private repositoryService: ArchitectureValuesRepositoryService,
    ) {

    
    this.diagnosticsService.info("foo");
    var a = exampleService.someField;
    this.diagnosticsService.info(a);

    //this.data : any=[];//[{ title: 'Ebony' }, { title: 'Chiho' }];
  }
  ngOnInit(): void {
    this.repositoryService
      .getAll()
      .subscribe((x:any) => {this.data = x;});
    }

  public DoSomething() {
    this.diagnosticsService.info("blah");
  }
}
