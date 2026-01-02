/**
 * Surveys Routing
 * 
 * Routes for survey module.
 */
import { Routes } from '@angular/router';

export const surveyRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/views/survey-hub/component')
      .then(m => m.SurveyHubComponent)
  },
  {
    path: 'take/:id',
    loadComponent: () => import('./ui/views/survey-take/component')
      .then(m => m.SurveyTakeComponent)
  },
  // Future routes:
  // { path: 'results/:id', loadComponent: () => ... },
  // { path: 'admin', loadChildren: () => ... },
];
