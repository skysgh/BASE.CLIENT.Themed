// Ag:
import { Component, ViewChild, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import {CommonModule} from '@angular/common'; 
// Etc:
import { Store } from '@ngrx/store';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
// Constants:
import { system as importedSystemConst } from '../../../../../core/constants/system';
//
import { SystemService } from '../../../../../core/services/system.service';
import { RootReducerState } from '../../../store';
// More:
import { initialState } from '../layouts/layout-reducers';
import { getLayoutMode, getLayoutPosition, getLayoutTheme, getLayoutWith, getPreloader, getSidebarColor, getSidebarImage, getSidebarSize, getSidebarView, getSidebarVisibilitye, getTopbarColor } from '../layouts/layout-selector';
import { changeDataPreloader, changeLayoutPosition, changeLayoutWidth, changeMode, changeSidebarColor, changeSidebarImage, changeSidebarSize, changeSidebarView, changeSidebarVisibility, changeTopbar, changelayout } from '../layouts/layout-action';
import { EventService } from '../../../../../core/services/infrastructure/event.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Right Sidebar component
 */
export class BaseLayoutRightsidebarComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  layout: string | undefined;
  mode: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  attribute: any;
  sidebarImage: any;
  preLoader: any;
  grd: any;
  sidebarVisibility: any;

  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();

  constructor(
    private eventService: EventService,
    private offcanvasService: NgbOffcanvas,
    private store: Store<RootReducerState>,
    private systemService: SystemService
  ) {

    // Can be either via service, or injecting the constats/settings object:
    //this.system = systemService.system;
}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.offcanvasService.hasOpenOffcanvas() == false) {
        this.openEnd(this.filtetcontent);
      };
    }, 1000);

    this.store.select('layout').subscribe((data) => {
      this.layout = data.LAYOUT;
      this.mode = data.LAYOUT_MODE;
      this.width = data.LAYOUT_WIDTH;
      this.position = data.LAYOUT_POSITION;
      this.topbar = data.TOPBAR;
      this.size = data.SIDEBAR_SIZE;
      this.sidebarView = data.SIDEBAR_VIEW;
      this.sidebar = data.SIDEBAR_COLOR;
      this.sidebarImage = data.SIDEBAR_IMAGE;
      this.preLoader = data.DATA_PRELOADER;
      //
      this.sidebarVisibility = data.SIDEBAR_VISIBILITY
    })
  }

  ngAfterViewInit() { }



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

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  //  Filter Offcanvas Set
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });

    setTimeout(() => {
      this.attribute = document.documentElement.getAttribute('data-layout')
      if (this.attribute == 'vertical') {
        var vertical = document.getElementById('customizer-layout01') as HTMLInputElement;
        if (vertical != null) {
          vertical.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'horizontal') {
        const horizontal = document.getElementById('customizer-layout02');
        if (horizontal != null) {
          horizontal.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'twocolumn') {
        const Twocolumn = document.getElementById('customizer-layout03');
        if (Twocolumn != null) {
          Twocolumn.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'semibox') {
        const Twocolumn = document.getElementById('customizer-layout04');
        if (Twocolumn != null) {
          Twocolumn.setAttribute('checked', 'true');
        }
      }
    }, 100);
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

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
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

