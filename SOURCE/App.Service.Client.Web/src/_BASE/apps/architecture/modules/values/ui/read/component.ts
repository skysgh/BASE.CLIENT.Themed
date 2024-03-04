import { Component, OnInit } from '@angular/core';
import { DiagnosticsService } from '../../../../../../shared/services/diagnostics.service';
import { ExampleService } from '../../../../../../shared/services/example.service';
import { ArchitectureValuesRepositoryService } from '../../../../services/values-repository.service';

import { Value } from '../../../../models/value.model';


@Component({
  selector: 'app-base-apps-architecture-value-read',
  templateUrl: './spike-read.component.html',
  styleUrls: ['./spike-read.component.scss']
})

export class ArchitectureBaseValuesReadComponent implements OnInit {

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
