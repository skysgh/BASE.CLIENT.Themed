import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { AppModule } from './apps/app.module';
import { environment } from './environments/environment';
import { AppModule } from './apps.bootstrap/module';  // ✅ UPDATED: Renamed from apps.main

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
