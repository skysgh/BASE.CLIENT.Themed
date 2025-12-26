// Ag:
import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule, DOCUMENT } from '@angular/common'; 
// Etc:
import { Store } from '@ngrx/store';
// Constants:
//
// Services:
//import { SystemService } from '../../../../../core/services/system.service';
// More:
import { RootReducerState } from '../../../_state';
import {
  changeDataPreloader,
  changeLayoutPosition,
  changeLayoutWidth,
  changeMode,
  changeSidebarColor,
  changeSidebarImage,
  changeSidebarSize,
  changeSidebarView,
  changeSidebarVisibility,
  changeTopbar,
  changelayout
} from '../../../_state/layout/layout-action';
import {
  getLayoutMode,
  getLayoutPosition,
  getLayoutTheme,
  getLayoutWith,
  getPreloader,
  getSidebarColor,
  getSidebarImage,
  getSidebarSize,
  getSidebarView,
  getSidebarVisibilitye,
  getTopbarColor
} from '../../../_state/layout/layout-selector';
import { appsConfiguration } from "../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
import { TranslationService } from "../../../../../core/services/translation.service";

@Component({
  selector: 'app-base-common-components-topbar-languagetheme-customiser',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutRightSideContextThemeCustomiserComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  mode: string | undefined;
  element: any = null; //HTMLElement

  attribute: any;

  width: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  sidebarVisibility: any;
  size: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  grd: any;
  sidebarImage: any;
  preLoader: any;

  constructor(@Inject(DOCUMENT)
  private document: any,
    private store: Store<RootReducerState>,
    //systemService: SystemService,
    public translationService: TranslationService
  ) {
    // Make system/env variables avaiable to view template (via singleton or service):

    
  }

  ngOnInit(): void {
  }

  /**
 * Change the layout onclick
 * @param layout Change the layout
 */
  changeLayout(layout: string) {
    this.attribute = layout;
    this.store.dispatch(changelayout({ layout }));
    this.store.select(getLayoutTheme).subscribe((layout) => {
      document.documentElement.setAttribute('data-layout', layout)
    })
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  // Mode Change
  changeMode(mode: string) {
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
    this.store.select(getLayoutMode).subscribe((mode) => {
      document.documentElement.setAttribute('data-bs-theme', mode)
    })
  }

  // Visibility Change
  changeVisibility(sidebarvisibility: string) {
    this.sidebarVisibility = sidebarvisibility;
    this.store.dispatch(changeSidebarVisibility({ sidebarvisibility }));
    this.store.select(getSidebarVisibilitye).subscribe((visibility) => {
      document.documentElement.setAttribute('data-sidebar-visibility', visibility)
    })
  }
  // Width Change
  changeWidth(layoutWidth: string, size: string) {
    this.width = layoutWidth;
    this.store.dispatch(changeLayoutWidth({ layoutWidth }));
    this.store.select(getLayoutWith).subscribe((width) => {
      document.documentElement.setAttribute('data-layout-width', width)
      document.documentElement.setAttribute('data-sidebar-size', size)
    })

  }
  // Position Change
  changePosition(layoutPosition: string) {
    this.position = layoutPosition;
    this.store.dispatch(changeLayoutPosition({ layoutPosition }));
    this.store.select(getLayoutPosition).subscribe((position) => {
      document.documentElement.setAttribute('data-layout-position', position);
    })
  }


  // Topbar Change
  changeTopColor(topbarColor: string) {
    this.topbar = topbarColor;
    this.store.dispatch(changeTopbar({ topbarColor }));
    this.store.select(getTopbarColor).subscribe((color) => {
      document.documentElement.setAttribute('data-topbar', color)
    })
  }

  // Sidebar Size Change
  changeSidebarSize(sidebarSize: string) {
    this.size = sidebarSize;
    this.store.dispatch(changeSidebarSize({ sidebarSize }));
    this.store.select(getSidebarSize).subscribe((size) => {
      document.documentElement.setAttribute('data-sidebar-size', size)
    })
  }

  // Sidebar Size Change
  changeSidebar(sidebarView: string) {
    this.sidebarView = sidebarView;
    this.store.dispatch(changeSidebarView({ sidebarView }));
    this.store.select(getSidebarView).subscribe((view) => {
      document.documentElement.setAttribute('data-layout-style', view);
    })
  }


  // Sidebar Color Change
  changeSidebarColor(sidebarColor: string) {
    this.sidebar = sidebarColor;
    this.store.dispatch(changeSidebarColor({ sidebarColor }));
    this.store.select(getSidebarColor).subscribe((color) => {
      document.documentElement.setAttribute('data-sidebar', color);
    })
  }

  // Add Active Class
  addActive(grdSidebar: any) {
    this.grd = grdSidebar;
    document.documentElement.setAttribute('data-sidebar', grdSidebar)
    document.getElementById('collapseBgGradient')?.classList.toggle('show');
    document.getElementById('collapseBgGradient1')?.classList.add('active');
  }

  // Remove Active Class
  removeActive() {
    this.grd = '';
    document.getElementById('collapseBgGradient1')?.classList.remove('active');
    document.getElementById('collapseBgGradient')?.classList.remove('show');
  }
  // Sidebar Image Change
  changeSidebarImage(sidebarImage: string) {
    this.sidebarImage = sidebarImage;
    this.store.dispatch(changeSidebarImage({ sidebarImage }));
    this.store.select(getSidebarImage).subscribe((image) => {
      document.documentElement.setAttribute('data-sidebar-image', image);
    })
  }

  // PreLoader Image Change
  changeLoader(Preloader: string) {
    this.preLoader = Preloader;
    this.store.dispatch(changeDataPreloader({ Preloader }));
    this.store.select(getPreloader).subscribe((loader) => {
      document.documentElement.setAttribute('data-preloader', loader);
    })

    var preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(function () {
        (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
        (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
      }, 1000);
    }
  }

}
