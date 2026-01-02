/**
 * Support Item Repository
 * 
 * Data access layer for support items.
 * Currently loads from JSON, future: API integration.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

import { SupportItemDto, SupportCommentDto } from '../models';
import { DEFAULT_SUPPORT_CONFIG } from '../constants';

@Injectable({ providedIn: 'root' })
export class SupportItemRepository {
  private http = inject(HttpClient);
  private basePath = DEFAULT_SUPPORT_CONFIG.assetsBasePath;

  /**
   * Get all support items
   */
  getAll(): Observable<SupportItemDto[]> {
    return this.http.get<SupportItemDto[]>(`${this.basePath}/items.json`).pipe(
      catchError(() => of(this.getMockItems()))
    );
  }

  /**
   * Get items by user ID
   */
  getByUserId(userId: string): Observable<SupportItemDto[]> {
    // For now, filter client-side from all items
    // Future: API endpoint with filtering
    return this.http.get<SupportItemDto[]>(`${this.basePath}/items.json`).pipe(
      catchError(() => of(this.getMockItems().filter(i => i.submittedBy === userId)))
    );
  }

  /**
   * Get single item by ID
   */
  getById(id: string): Observable<SupportItemDto | null> {
    return this.http.get<SupportItemDto>(`${this.basePath}/items/${id}.json`).pipe(
      catchError(() => {
        const item = this.getMockItems().find(i => i.id === id);
        return of(item || null);
      })
    );
  }

  /**
   * Get comments for an item
   */
  getComments(itemId: string): Observable<SupportCommentDto[]> {
    return this.http.get<SupportCommentDto[]>(`${this.basePath}/items/${itemId}/comments.json`).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Create new item (mock - would POST to API)
   */
  create(dto: Partial<SupportItemDto>): Observable<SupportItemDto> {
    const now = new Date().toISOString();
    const newItem: SupportItemDto = {
      id: crypto.randomUUID(),
      type: dto.type || 'issue',
      title: dto.title || '',
      description: dto.description || '',
      status: 'new',
      priority: dto.priority || 'medium',
      submittedBy: dto.submittedBy || '',
      submittedByName: dto.submittedByName,
      createdUtc: now,
      updatedUtc: now,
    };
    // In real impl, POST to API
    return of(newItem);
  }

  /**
   * Add comment (mock - would POST to API)
   */
  addComment(itemId: string, content: string, authorId: string, authorName: string): Observable<SupportCommentDto> {
    const now = new Date().toISOString();
    const comment: SupportCommentDto = {
      id: crypto.randomUUID(),
      itemId,
      authorId,
      authorName,
      content,
      internal: false,
      createdUtc: now,
    };
    return of(comment);
  }

  /**
   * Mock data for development
   */
  private getMockItems(): SupportItemDto[] {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: '1',
        type: 'issue',
        title: 'Login button not responding',
        description: 'When I click the login button on the landing page, nothing happens. Tested on Chrome and Firefox.',
        status: 'in-progress',
        priority: 'high',
        submittedBy: 'user-1',
        submittedByName: 'John Doe',
        assignedTo: 'admin-1',
        assignedToName: 'Support Team',
        category: 'Authentication',
        createdUtc: dayAgo.toISOString(),
        updatedUtc: now.toISOString(),
      },
      {
        id: '2',
        type: 'idea',
        title: 'Add dark mode support',
        description: 'It would be great to have a dark mode option for late night usage.',
        status: 'triaged',
        priority: 'medium',
        submittedBy: 'user-1',
        submittedByName: 'John Doe',
        category: 'UI/UX',
        createdUtc: weekAgo.toISOString(),
        updatedUtc: weekAgo.toISOString(),
      },
      {
        id: '3',
        type: 'issue',
        title: 'Export PDF not working',
        description: 'The export to PDF feature throws an error when the report has more than 10 pages.',
        status: 'new',
        priority: 'medium',
        submittedBy: 'user-2',
        submittedByName: 'Jane Smith',
        category: 'Reports',
        createdUtc: now.toISOString(),
        updatedUtc: now.toISOString(),
      },
      {
        id: '4',
        type: 'issue',
        title: 'Session timeout too short',
        description: 'The session times out after 5 minutes of inactivity which is too aggressive.',
        status: 'resolved',
        priority: 'low',
        submittedBy: 'user-1',
        submittedByName: 'John Doe',
        assignedTo: 'admin-1',
        assignedToName: 'Support Team',
        category: 'Security',
        createdUtc: weekAgo.toISOString(),
        updatedUtc: dayAgo.toISOString(),
        resolvedUtc: dayAgo.toISOString(),
      },
    ];
  }
}
