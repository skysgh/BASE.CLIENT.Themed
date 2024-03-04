// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

// Import Common:
import { DiagnosticsService } from '../../../../../../shared/services/diagnostics.service';
import { ExampleService } from '../../../../../../shared/services/example.service';
// Import Module:
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
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

    private diagnosticsService: DiagnosticsService,
    private exampleService: ExampleService,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    this.diagnosticsService.info("Constructor");
  }


  ngOnInit(): void {
    this.diagnosticsService.info("Component OnInit");

    this.route.params.subscribe(params => {
      this.diagnosticsService.info("params ready");
      this.diagnosticsService.info('id: ' + params['id']);
      this.repositoryService.get(params['id']).subscribe(x => {
        this.diagnosticsService.info('got X: ' + x.title);
        this.data = x
      });
    });

    //var id = this.route.snapshot.paramMap.get('id')!;

    //this.route.paramMap.pipe(
    //  switchMap((params: ParamMap) => {
    //    var id = params.get('id');
    //    this.data = this.repositoryService.get(params.get('id'));
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
    this.diagnosticsService.info("blah");
  }
}
