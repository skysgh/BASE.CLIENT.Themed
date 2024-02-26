// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { ExampleService } from '../../../../../../common/services/example.service';
// Import Module:
import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
// Import Models:
import { Spike } from '../../../../models/spike.model';


@Component({
  selector: 'app-apps-spikes-spike-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SpikesSpikeReadComponent implements OnInit {

  public data?: Spike[] = [];

  constructor(
    private diagnosticsService: DiagnosticsService,
    private exampleService: ExampleService,
    private repositoryService: SpikeSpikesRepositoryService,
  ) {
    this.diagnosticsService.info("Constructor");

    var a = exampleService.someField;
    this.diagnosticsService.info(a);

    //this.data : any=[];//[{ title: 'Ebony' }, { title: 'Chiho' }];
  }


  ngOnInit(): void {
    this.diagnosticsService.info("Component OnInit");
  }

  public DoSomething() {
    this.diagnosticsService.info("blah");
  }
}
