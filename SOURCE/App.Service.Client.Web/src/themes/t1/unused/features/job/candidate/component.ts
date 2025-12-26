// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';
// Data:
import { candidates } from './data';


@Component({
  selector: 'app-candidate',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class CandidateComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  candidates: any;

  constructor(private defaultControllerServices: DefaultComponentServices) { }

  ngOnInit(): void {
    // Fetch Data
    this.candidates = candidates
  }

  /**
  * Swiper Responsive setting
  */
  public Responsive = {
    infinite: true,
    slidesToShow: 4,
    autoplay: true,
    dots: true,
    arrows: false
  };

}
