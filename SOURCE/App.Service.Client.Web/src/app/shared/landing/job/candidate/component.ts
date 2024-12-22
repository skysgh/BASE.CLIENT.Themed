import { Component, OnInit } from '@angular/core';

// Pipes:
import { BaseTranslatePipe } from '../../../../../_BASE/core/modules/common/pipes/basetranslate.pipe';

import { candidates } from './data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-candidate',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class CandidateComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  candidates: any;

  constructor() { }

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
