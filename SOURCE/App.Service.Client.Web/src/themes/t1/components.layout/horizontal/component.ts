import { Component, OnInit } from '@angular/core';
import { ViewModel } from '../vm';
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';

@Component({
  selector: 'app-horizontal',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Horizontal Component
 */
export class BaseLayoutHorizontalComponent implements OnInit {

  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private defaultComponentServices: DefaultComponentServices) { }
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
