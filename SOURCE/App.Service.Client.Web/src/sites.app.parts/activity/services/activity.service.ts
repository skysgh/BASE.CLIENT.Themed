/**
 * Activity Service
 * 
 * Provides access to user activity/events.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Activity, ACTIVITY_TYPE_ICONS } from '../models';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/service_Activities';

  /**
   * Get recent activities
   */
  getRecentActivities(limit: number = 10): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.API_URL}?_sort=createdUtc&_order=desc&_limit=${limit}`)
      .pipe(
        map(activities => activities.map(a => this.enrichActivity(a))),
        catchError(() => of(this.getMockActivities()))
      );
  }

  /**
   * Get activities for a specific entity
   */
  getActivitiesForEntity(entityType: string, entityId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.API_URL}?entityType=${entityType}&entityId=${entityId}&_sort=createdUtc&_order=desc`)
      .pipe(
        map(activities => activities.map(a => this.enrichActivity(a))),
        catchError(() => of([]))
      );
  }

  /**
   * Enrich activity with icon and color from type
   */
  private enrichActivity(activity: Activity): Activity {
    const typeInfo = ACTIVITY_TYPE_ICONS[activity.type] || { icon: 'bx bx-info-circle', color: 'secondary' };
    return {
      ...activity,
      icon: activity.icon || typeInfo.icon,
      iconColor: activity.iconColor || typeInfo.color,
    };
  }

  /**
   * Mock activities for fallback
   */
  private getMockActivities(): Activity[] {
    const now = new Date();
    return [
      {
        id: '1',
        title: 'Created new spike "Search Sync"',
        description: 'New spike created',
        type: 'created',
        entityType: 'spike',
        entityId: 'spike-001',
        entityRoute: '/apps/spike/spikes/spike-001',
        createdUtc: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        createdByUserName: 'User',
      },
      {
        id: '2',
        title: 'Updated spike status to In Progress',
        description: 'Status changed',
        type: 'status_changed',
        entityType: 'spike',
        entityId: 'spike-002',
        entityRoute: '/apps/spike/spikes/spike-002',
        createdUtc: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        createdByUserName: 'User',
      },
      {
        id: '3',
        title: 'Submitted feedback request',
        description: 'Feedback requested',
        type: 'submitted',
        entityType: 'feedback',
        entityId: 'feedback-001',
        createdUtc: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        createdByUserName: 'User',
      },
    ].map(a => this.enrichActivity(a as Activity));
  }
}
