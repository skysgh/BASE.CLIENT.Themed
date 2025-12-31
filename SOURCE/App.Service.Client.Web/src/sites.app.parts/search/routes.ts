import { Routes } from '@angular/router';

/**
 * Service Search Routes
 * 
 * /search              → Universal search hub
 * /search?q=term       → Pre-populated search
 * /search?type=spike   → Filtered by entity type
 */
export const searchRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/search-hub/component').then(m => m.SearchHubComponent),
  }
];
