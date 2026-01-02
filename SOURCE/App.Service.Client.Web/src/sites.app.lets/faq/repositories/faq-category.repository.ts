/**
 * FAQ Category Repository
 * 
 * Data access layer for FAQ categories.
 * Currently loads from JSON, future: API integration.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

import { FaqCategoryDto } from '../models';
import { DEFAULT_FAQ_CONFIG } from '../constants';

@Injectable({ providedIn: 'root' })
export class FaqCategoryRepository {
  private http = inject(HttpClient);
  private basePath = DEFAULT_FAQ_CONFIG.assetsBasePath;

  /**
   * Get all categories
   */
  getAll(cultureCode: string = 'en'): Observable<FaqCategoryDto[]> {
    return this.http.get<FaqCategoryDto[]>(`${this.basePath}/${cultureCode}/categories.json`).pipe(
      catchError(() => of(this.getMockCategories(cultureCode)))
    );
  }

  /**
   * Get enabled categories only
   */
  getEnabled(cultureCode: string = 'en'): Observable<FaqCategoryDto[]> {
    return this.getAll(cultureCode).pipe(
      map(categories => categories.filter(c => c.enabled))
    );
  }

  /**
   * Get single category by ID
   */
  getById(id: string): Observable<FaqCategoryDto | null> {
    // For now, find from all categories
    return this.getAll().pipe(
      map(categories => categories.find(c => c.id === id) || null)
    );
  }

  /**
   * Create new category (mock - would POST to API)
   */
  create(dto: Partial<FaqCategoryDto>): Observable<FaqCategoryDto> {
    const now = new Date().toISOString();
    const newCategory: FaqCategoryDto = {
      id: crypto.randomUUID(),
      title: dto.title || '',
      description: dto.description,
      icon: dto.icon || 'bx-help-circle',
      order: dto.order || 0,
      enabled: dto.enabled ?? true,
      cultureCode: dto.cultureCode || 'en',
      createdUtc: now,
      updatedUtc: now,
    };
    // In real impl, POST to API
    return of(newCategory);
  }

  /**
   * Update category (mock - would PUT to API)
   */
  update(id: string, dto: Partial<FaqCategoryDto>): Observable<FaqCategoryDto> {
    const now = new Date().toISOString();
    const updated: FaqCategoryDto = {
      id,
      title: dto.title || '',
      description: dto.description,
      icon: dto.icon || 'bx-help-circle',
      order: dto.order || 0,
      enabled: dto.enabled ?? true,
      cultureCode: dto.cultureCode || 'en',
      createdUtc: dto.createdUtc || now,
      updatedUtc: now,
    };
    return of(updated);
  }

  /**
   * Delete category (mock - would DELETE to API)
   */
  delete(id: string): Observable<boolean> {
    // In real impl, DELETE to API
    return of(true);
  }

  /**
   * Mock data for development
   */
  private getMockCategories(cultureCode: string): FaqCategoryDto[] {
    const now = new Date().toISOString();
    return [
      {
        id: '00000000-0000-0000-0000-000000000001',
        title: 'General Questions',
        description: 'Common questions about our service',
        icon: 'bx-help-circle',
        order: 1,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        title: 'Privacy & Security',
        description: 'Questions about data protection and security',
        icon: 'bx-shield',
        order: 2,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        title: 'Account & Billing',
        description: 'Questions about your account and payments',
        icon: 'bx-credit-card',
        order: 3,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        title: 'Technical Support',
        description: 'Troubleshooting and technical questions',
        icon: 'bx-wrench',
        order: 4,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
    ];
  }
}
