/**
 * FAQ Item Repository
 * 
 * Data access layer for FAQ items.
 * Currently loads from JSON, future: API integration.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

import { FaqItemDto } from '../models';
import { DEFAULT_FAQ_CONFIG } from '../constants';

@Injectable({ providedIn: 'root' })
export class FaqItemRepository {
  private http = inject(HttpClient);
  private basePath = DEFAULT_FAQ_CONFIG.assetsBasePath;

  /**
   * Get all items
   */
  getAll(cultureCode: string = 'en'): Observable<FaqItemDto[]> {
    return this.http.get<FaqItemDto[]>(`${this.basePath}/${cultureCode}/items.json`).pipe(
      catchError(() => of(this.getMockItems(cultureCode)))
    );
  }

  /**
   * Get enabled items only
   */
  getEnabled(cultureCode: string = 'en'): Observable<FaqItemDto[]> {
    return this.getAll(cultureCode).pipe(
      map(items => items.filter(i => i.enabled))
    );
  }

  /**
   * Get items by category
   */
  getByCategory(categoryId: string, cultureCode: string = 'en'): Observable<FaqItemDto[]> {
    return this.getAll(cultureCode).pipe(
      map(items => items.filter(i => i.categoryId === categoryId))
    );
  }

  /**
   * Get single item by ID
   */
  getById(id: string): Observable<FaqItemDto | null> {
    return this.getAll().pipe(
      map(items => items.find(i => i.id === id) || null)
    );
  }

  /**
   * Create new item (mock - would POST to API)
   */
  create(dto: Partial<FaqItemDto>): Observable<FaqItemDto> {
    const now = new Date().toISOString();
    const newItem: FaqItemDto = {
      id: crypto.randomUUID(),
      categoryId: dto.categoryId || '',
      question: dto.question || '',
      answer: dto.answer || '',
      order: dto.order || 0,
      enabled: dto.enabled ?? true,
      cultureCode: dto.cultureCode || 'en',
      tags: dto.tags || [],
      createdUtc: now,
      updatedUtc: now,
    };
    return of(newItem);
  }

  /**
   * Update item (mock - would PUT to API)
   */
  update(id: string, dto: Partial<FaqItemDto>): Observable<FaqItemDto> {
    const now = new Date().toISOString();
    const updated: FaqItemDto = {
      id,
      categoryId: dto.categoryId || '',
      question: dto.question || '',
      answer: dto.answer || '',
      order: dto.order || 0,
      enabled: dto.enabled ?? true,
      cultureCode: dto.cultureCode || 'en',
      tags: dto.tags || [],
      createdUtc: dto.createdUtc || now,
      updatedUtc: now,
    };
    return of(updated);
  }

  /**
   * Delete item (mock - would DELETE to API)
   */
  delete(id: string): Observable<boolean> {
    return of(true);
  }

  /**
   * Mock data for development
   */
  private getMockItems(cultureCode: string): FaqItemDto[] {
    const now = new Date().toISOString();
    return [
      // General Questions
      {
        id: 'faq-1',
        categoryId: '00000000-0000-0000-0000-000000000001',
        question: 'What is this service?',
        answer: 'This is a comprehensive platform designed to help you manage your business operations efficiently.',
        order: 1,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: 'faq-2',
        categoryId: '00000000-0000-0000-0000-000000000001',
        question: 'How do I get started?',
        answer: 'Getting started is easy! Simply sign up for an account, complete the onboarding wizard, and you\'re ready to go.',
        order: 2,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: 'faq-3',
        categoryId: '00000000-0000-0000-0000-000000000001',
        question: 'Is there a free trial?',
        answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required.',
        order: 3,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      // Privacy & Security
      {
        id: 'faq-4',
        categoryId: '00000000-0000-0000-0000-000000000002',
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All data is stored in secure, SOC 2 compliant data centers.',
        order: 1,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: 'faq-5',
        categoryId: '00000000-0000-0000-0000-000000000002',
        question: 'Can I export my data?',
        answer: 'Absolutely! You can export all your data at any time in standard formats like CSV or JSON. We believe in data portability.',
        order: 2,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      // Account & Billing
      {
        id: 'faq-6',
        categoryId: '00000000-0000-0000-0000-000000000003',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and bank transfers for enterprise accounts.',
        order: 1,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: 'faq-7',
        categoryId: '00000000-0000-0000-0000-000000000003',
        question: 'Can I cancel my subscription?',
        answer: 'Yes, you can cancel at any time. If you cancel, you\'ll continue to have access until the end of your billing period.',
        order: 2,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      // Technical Support
      {
        id: 'faq-8',
        categoryId: '00000000-0000-0000-0000-000000000004',
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend Chrome.',
        order: 1,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
      {
        id: 'faq-9',
        categoryId: '00000000-0000-0000-0000-000000000004',
        question: 'Is there a mobile app?',
        answer: 'Yes! Our mobile apps for iOS and Android are available on the App Store and Google Play.',
        order: 2,
        enabled: true,
        cultureCode,
        createdUtc: now,
        updatedUtc: now,
      },
    ];
  }
}
