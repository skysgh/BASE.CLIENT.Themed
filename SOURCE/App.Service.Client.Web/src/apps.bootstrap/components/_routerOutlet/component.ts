// Ag:
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";

// ✅ NEW: Use ConfigRegistry instead of direct import
import { ConfigRegistryService } from '../../../core/services/config-registry.service';
// Services:
import { TitleService } from '../../../core/services/title.service';
import { AppReadinessService } from '../../../core/services/app-readiness.service';
import { EnvConfigService } from '../../../core/services/env-config.service';



@Component({
  selector: 'app-root',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
/**
 * Root Component
 * 
 * ✅ MIGRATED: No longer imports appsConfiguration directly
 * 
 * Uses environment-driven configuration:
 * - App name comes from env-config.json → "BOOM!"
 * - Cascading config: deployed → mock → backend
 * - Pure HTML splash prevents flash
 * 
 * Benefits:
 * ✅ No circular dependency
 * ✅ Runtime config override (no redeploy)
 * ✅ Easy to test (mock config)
 */
export class BaseRouterOutletComponent implements OnInit {
  // App name from environment config
  public appName: string = 'Loading...';
  
  public browserTitle: string = '';
  
  private firstNavigationComplete = false;

  /**
   * Constructor.
   * @param titleService
   * @param appReadiness
   * @param envConfig - Environment configuration service
   * @param configRegistry - Config registry (breaks circular dependency)
   * @param router - Angular Router for navigation events
   */
  constructor(
    private titleService: TitleService,
    public appReadiness: AppReadinessService,
    private envConfig: EnvConfigService,
    private configRegistry: ConfigRegistryService,
    private router: Router
  ) {
    // Title will be set in ngOnInit after config loads
  }
  
  ngOnInit(): void {
    // ✅ Listen to router events (actual render signal!)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // First navigation complete = Angular has rendered the first view
      if (!this.firstNavigationComplete) {
        this.firstNavigationComplete = true;
        console.log('✅ [RouterOutlet] First navigation complete - Angular rendered');
        
        // NOW hide splash (we KNOW content is visible)
        this.hideSplashAfterRender();
      }
    });
    
    // Subscribe to app readiness
    this.appReadiness.isReady$.subscribe(ready => {
      if (ready) {
        // ✅ Config is loaded, get app name from cascading config
        try {
          // ✅ EnvConfig has been cascaded (deployed → mock → backend)
          const envConfig = this.envConfig.get();
          this.appName = envConfig.app.name;  // Should be "BOOM!" from mock JSON!
          
          // ✅ Also try to get from registry (might not be there yet)
          try {
            const appsConfig: any = this.configRegistry.get('apps');
            console.log('✅ [RouterOutlet] App name from Registry:', appsConfig?.app?.name || 'Not in registry');
          } catch (registryError) {
            console.log('⚠️ [RouterOutlet] Registry not ready yet (OK, will register later)');
          }
          
          // Set browser title with cascaded config
          this.setTheBrowserTitle(
            `${envConfig.app.name} - ${envConfig.app.title}`
          );
          
          console.log('✅ [RouterOutlet] App name from EnvConfig:', envConfig.app.name);
          console.log('📊 [RouterOutlet] Full EnvConfig:', envConfig);
          
        } catch (error) {
          console.warn('⚠️ [RouterOutlet] Could not load app name from config:', error);
          this.appName = 'BASE';  // Fallback
        }
        
        // Don't hide splash here anymore!
        // Wait for router event instead.
      }
    });
    
    // Mark theme as ready immediately (no theme loading implemented yet)
    this.appReadiness.markReady('theme');
  }
  
  /**
   * Hide splash screen AFTER Angular has rendered
   * 
   * ✅ Called from Router event (not timer!)
   * ⚠️ BUT: Still needs small delay for i18n pipe binding
   * 
   * Why the delay:
   * - NavigationEnd = route component created ✅
   * - But i18n pipes haven't bound yet ⚠️
   * - Small delay (200ms) lets pipes bind
   * - Prevents flash of {{translation.key}}
   * 
   * Strategy:
   * 1. Router NavigationEnd event fires (route ready)
   * 2. Wait 200ms for i18n pipes to bind
   * 3. Start crossfade transition
   * 4. Remove splash after fade complete
   */
  private hideSplashAfterRender(): void {
    // ✅ Shorter delay than before (200ms not 500ms)
    // Because we KNOW route rendered (not guessing)
    // Just waiting for i18n pipes to bind
    setTimeout(() => {
      // Mark app-root as ready (fade in)
      const appRoot = document.querySelector('app-root');
      appRoot?.classList.add('ready');
      
      // Simultaneously start hiding splash
      const splash = document.getElementById('app-splash');
      splash?.classList.add('loaded');
      
      console.log('🎨 [RouterOutlet] Starting splash fade transition');
      
      // Remove splash from DOM after transition completes
      setTimeout(() => {
        splash?.remove();
        console.log('✅ [RouterOutlet] Splash removed - app fully visible');
      }, 600);  // Match CSS transition time
      
    }, 200);  // ✅ Shorter! Just for i18n pipe binding
  }

  private setTheBrowserTitle(title:string='') {
    this.titleService.set(title);
    this.browserTitle = title;
    console.log(`📄 [RouterOutlet] Browser title set: "${title}"`);
  }
}
