// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc
import { Store } from '@ngrx/store';
// Configuration:
import { appsConfiguration } from '../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';
// Data:
import { RootReducerState } from '../_state';
import { filter } from 'rxjs/operators';
import { initialLayoutState } from '../_state/layout/layout-state';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: false
})

/**
 * Layout Component
 */
export class AppLayoutComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // ✅ Initialize with default value from initial state
  layoutType: string = initialLayoutState.LAYOUT;

  constructor(private store: Store<RootReducerState>,
    private defaultControllerServices: DefaultComponentServices
  ) { }

  ngOnInit(): void {
    this.store.select('layout').pipe(
      // ✅ Filter out undefined/null state AND ensure LAYOUT property exists
      filter(data => data != null && data.LAYOUT != null)
    ).subscribe((data) => {
      this.layoutType = data.LAYOUT;

      document.documentElement.setAttribute('data-layout', data.LAYOUT);
      document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_MODE);
      document.documentElement.setAttribute('data-layout-width', data.LAYOUT_WIDTH);
      document.documentElement.setAttribute('data-layout-position', data.LAYOUT_POSITION);
      document.documentElement.setAttribute('data-topbar', data.TOPBAR);

      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR) : '';
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar-image', data.SIDEBAR_IMAGE) : '';
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-layout-style', data.SIDEBAR_VIEW) : '';

      document.documentElement.setAttribute('data-preloader', data.DATA_PRELOADER)
      document.documentElement.setAttribute('data-sidebar-visibility', data.SIDEBAR_VISIBILITY);
    })

  }


  /**
  * Check if the vertical layout is requested
  */
  isVerticalLayoutRequested() {
    return this.layoutType === 'vertical';
  }

  /**
   * Check if the semibox layout is requested
   */
  isSemiboxLayoutRequested() {
    return this.layoutType === 'semibox';
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === 'horizontal';
  }

  /**
   * Check if the horizontal layout is requested
   */
  isTwoColumnLayoutRequested() {
    return this.layoutType === 'twocolumn';
  }

}
