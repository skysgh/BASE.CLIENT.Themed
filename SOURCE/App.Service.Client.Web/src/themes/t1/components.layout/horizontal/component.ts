import { Component, OnInit, inject } from '@angular/core';
import { ViewModel } from '../vm';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

@Component({
    selector: 'app-horizontal',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Horizontal Layout Component
 * 
 * ✅ DECOUPLED: No cross-tier imports (appsConfiguration removed)
 */
export class BaseLayoutHorizontalComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);

  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

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
