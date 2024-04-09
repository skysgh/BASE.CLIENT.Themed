// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

// Import Common:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { ExampleService } from '../../../../../../core/services/example.service';
// Import Module:
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
// Import Models:
import { Spike } from '../../../../models/spike.model';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-base-apps-spike-spikes-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesReadComponent implements OnInit {

  public data?: Spike;


  constructor(
    //Observable of the matrix params:
    private route: ActivatedRoute,
    private router: Router,

    private translate: TranslateService,

    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private exampleService: ExampleService,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    this.diagnosticsTraceService.info("Constructor");
  }


  ngOnInit(): void {
    this.diagnosticsTraceService.info("Component OnInit");

    this.route.params.subscribe(params => {
      this.diagnosticsTraceService.info(`params ready. id:${params['id']}`);

      this.repositoryService.getSingle(params['id']).subscribe(x => {
        this.diagnosticsTraceService.info('got X: ' + x!.title);
        this.data = x!
      });
    });

    //var id = this.route.snapshot.paramMap.get('id')!;

    //this.route.paramMap.pipe(
    //  switchMap((params: ParamMap) => {
    //    var id = params.get('id');
    //    this.data = this.repositoryService.getSingle(params.get('id'));
    //  }
    //);

    
    //var data = this.repositoryService.get(id);



    //var id = params.get('id');

  //  this.data = this.route.paramMap.pipe(
  //    switchMap((params: ParamMap) =>
  //      this.service.getHero(params.get('id')!))
  //  );
  }

  public DoSomething() {
    this.diagnosticsTraceService.info("blah");
  }
}
