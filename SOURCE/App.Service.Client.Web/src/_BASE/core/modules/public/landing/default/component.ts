import { Component, OnInit } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';

//import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
// Models:
//import { Spike } from '../../../../models/spike.model';
//import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-custom-public-landing-Default',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class AppPublicLandingDefaultComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  ngOnInit(): void {
    }
}
