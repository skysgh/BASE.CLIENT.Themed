// Rx:
// 
// Ag:
import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { IHasMenuItem } from '../../../../core/models/contracts/IHasMenuItem';
// Configuration:
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
import { AccountService } from '../../../../core/services/account.service';
import { ThemeT1NavigationAdapter } from '../../services/theme-navigation-adapter.service';
// Models:
import { ViewModel } from './vm';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class BaseLayoutSidebarComponent implements OnInit, OnDestroy {
  
  // ✅ CONVENTION: Expose tier configuration as 'tierConfiguration'
  public tierConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  menu: any;
  toggle: any = true;
  menuItems: IHasMenuItem[] = [];

  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  // ✅ Account-aware logo paths
  public logoDark$: Observable<string | undefined>;
  public logoLight$: Observable<string | undefined>;
  public logoSm$: Observable<string | undefined>;

  // Cleanup subject
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService,
    private navigationAdapter: ThemeT1NavigationAdapter
  ) {
    // ✅ Get logos from account config
    this.logoDark$ = this.accountService.getConfigValue('branding.logo');
    this.logoLight$ = this.accountService.getConfigValue('branding.logoDark');
    this.logoSm$ = this.accountService.getConfigValue('branding.logoSm');
  }

  ngOnInit(): void {
    // ✅ Subscribe to menu items reactively (updates when navigation data changes)
    this.navigationAdapter.getMenuItems$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.menuItems = items;
        // Re-initialize active menu when items change
        setTimeout(() => this.initActiveMenu(), 0);
      });
    
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (document.documentElement.getAttribute('data-layout') != "twocolumn") {
          if (event instanceof NavigationEnd) {
            this.initActiveMenu();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      item.classList.remove("active");
    });
  }

  toggleItem(item: any) {
    this.menuItems.forEach((menuItem: any) => {

      if (menuItem == item) {
        menuItem.isCollapsed = !menuItem.isCollapsed
      } else {
        menuItem.isCollapsed = true
      }
      if (menuItem.subItems) {
        menuItem.subItems.forEach((subItem: any) => {

          if (subItem == item) {
            menuItem.isCollapsed = !menuItem.isCollapsed
            subItem.isCollapsed = !subItem.isCollapsed
          } else {
            subItem.isCollapsed = true
          }
          if (subItem.subItems) {
            subItem.subItems.forEach((childitem: any) => {

              if (childitem == item) {
                childitem.isCollapsed = !childitem.isCollapsed
                subItem.isCollapsed = !subItem.isCollapsed
                menuItem.isCollapsed = !menuItem.isCollapsed
              } else {
                childitem.isCollapsed = true
              }
              if (childitem.subItems) {
                childitem.subItems.forEach((childrenitem: any) => {

                  if (childrenitem == item) {
                    childrenitem.isCollapsed = false
                    childitem.isCollapsed = false
                    subItem.isCollapsed = false
                    menuItem.isCollapsed = false
                  } else {
                    childrenitem.isCollapsed = true
                  }
                })
              }
            })
          }
        })
      }
    });
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    let pathName = window.location.pathname;
    // Check if the application is running in production
    if (this.tierConfiguration.constants.environment.production) {
      // Modify pathName for production build
      pathName = pathName.replace('/base/angular/minimal', '');
    }

    const active = this.findMenuItem(pathName, this.menuItems)
    this.toggleItem(active)
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        if (this.tierConfiguration.constants.environment.production) {
          let path = x.pathname
          path = path.replace('/base/angular/minimal', '');
          return path === pathName;
        } else {
          return x.pathname === pathName;
        }

      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  private findMenuItem(pathname: string, menuItems: any[]): any {
    for (const menuItem of menuItems) {
      if (menuItem.link && menuItem.link === pathname) {
        return menuItem;
      }

      if (menuItem.subItems) {
        const foundItem = this.findMenuItem(pathname, menuItem.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }

    return null;
  }
  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: IHasMenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover');

    } else {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active')
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
}
