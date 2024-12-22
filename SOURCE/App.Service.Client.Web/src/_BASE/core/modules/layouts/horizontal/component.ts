import { Component, OnInit } from '@angular/core';
import { ViewModel } from '../vm';

// Pipes:
import { BaseTranslatePipe } from '../../common/pipes/basetranslate.pipe';

@Component({
  selector: 'app-horizontal',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Horizontal Component
 */
export class BaseLayoutHorizontalComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor() { }
  isCondensed = false;
  ngOnInit(): void {
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");
    }
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle('menu');
    }
  }
}
