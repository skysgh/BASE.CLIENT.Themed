import { Component, OnInit } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../_BASE/core/modules/common/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-jobcategories',
  templateUrl: './jobcategories.component.html',
  styleUrls: ['./jobcategories.component.scss']
})
export class JobcategoriesComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  constructor() { }

  ngOnInit(): void {
  }

}
