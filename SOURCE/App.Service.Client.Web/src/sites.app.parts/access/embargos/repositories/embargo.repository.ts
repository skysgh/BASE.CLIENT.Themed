/**
 * Embargo Repository
 * 
 * Data access for embargo records.
 * Uses fake data for demo, replace with HTTP calls for production.
 */
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { EmbargoDto, CreateEmbargoDto, UpdateEmbargoDto } from '../models/embargo.dto';

@Injectable({ providedIn: 'root' })
export class EmbargoRepository {
  
  private readonly STORAGE_KEY = 'base_embargos';
  
  constructor() {
    this.seedIfEmpty();
  }
  
  /**
   * Get all embargoes
   */
  getAll(): Observable<EmbargoDto[]> {
    const data = this.loadFromStorage();
    return of(data).pipe(delay(300)); // Simulate network delay
  }
  
  /**
   * Get embargo by ID
   */
  getById(id: string): Observable<EmbargoDto | null> {
    const data = this.loadFromStorage();
    const found = data.find(e => e.id === id) || null;
    return of(found).pipe(delay(200));
  }
  
  /**
   * Get embargo by country code
   */
  getByCountryCode(code: string): Observable<EmbargoDto | null> {
    const data = this.loadFromStorage();
    const found = data.find(e => e.countryCode === code.toUpperCase()) || null;
    return of(found).pipe(delay(200));
  }
  
  /**
   * Create new embargo
   */
  create(dto: CreateEmbargoDto): Observable<EmbargoDto> {
    const data = this.loadFromStorage();
    const now = new Date().toISOString();
    
    const newEmbargo: EmbargoDto = {
      id: this.generateId(),
      countryCode: dto.countryCode.toUpperCase(),
      countryName: dto.countryName,
      reason: dto.reason,
      legalReference: dto.legalReference,
      effectiveFrom: dto.effectiveFrom || now,
      effectiveTo: dto.effectiveTo || null,
      enabled: dto.enabled ?? true,
      createdAt: now,
      updatedAt: now
    };
    
    data.push(newEmbargo);
    this.saveToStorage(data);
    
    return of(newEmbargo).pipe(delay(300));
  }
  
  /**
   * Update embargo
   */
  update(id: string, dto: UpdateEmbargoDto): Observable<EmbargoDto | null> {
    const data = this.loadFromStorage();
    const index = data.findIndex(e => e.id === id);
    
    if (index === -1) return of(null).pipe(delay(200));
    
    const updated: EmbargoDto = {
      ...data[index],
      ...dto,
      updatedAt: new Date().toISOString()
    };
    
    data[index] = updated;
    this.saveToStorage(data);
    
    return of(updated).pipe(delay(300));
  }
  
  /**
   * Toggle embargo enabled state
   */
  toggle(id: string): Observable<EmbargoDto | null> {
    const data = this.loadFromStorage();
    const embargo = data.find(e => e.id === id);
    
    if (!embargo) return of(null).pipe(delay(200));
    
    return this.update(id, { enabled: !embargo.enabled });
  }
  
  /**
   * Delete embargo
   */
  delete(id: string): Observable<boolean> {
    const data = this.loadFromStorage();
    const index = data.findIndex(e => e.id === id);
    
    if (index === -1) return of(false).pipe(delay(200));
    
    data.splice(index, 1);
    this.saveToStorage(data);
    
    return of(true).pipe(delay(300));
  }
  
  // === Private Methods ===
  
  private loadFromStorage(): EmbargoDto[] {
    const json = localStorage.getItem(this.STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  }
  
  private saveToStorage(data: EmbargoDto[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
  
  private generateId(): string {
    return `emb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private seedIfEmpty(): void {
    const existing = this.loadFromStorage();
    if (existing.length > 0) return;
    
    const now = new Date().toISOString();
    const seedData: EmbargoDto[] = [
      {
        id: 'emb_seed_001',
        countryCode: 'KP',
        countryName: 'North Korea',
        reason: 'International sanctions - UN Security Council resolutions',
        legalReference: 'UN Resolution 1718',
        effectiveFrom: '2006-10-14T00:00:00Z',
        effectiveTo: null,
        enabled: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'emb_seed_002',
        countryCode: 'IR',
        countryName: 'Iran',
        reason: 'US sanctions and export controls',
        legalReference: 'EAR Part 746',
        effectiveFrom: '2020-01-01T00:00:00Z',
        effectiveTo: null,
        enabled: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'emb_seed_003',
        countryCode: 'SY',
        countryName: 'Syria',
        reason: 'Trade sanctions',
        legalReference: 'OFAC SDN List',
        effectiveFrom: '2011-08-18T00:00:00Z',
        effectiveTo: null,
        enabled: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'emb_seed_004',
        countryCode: 'RU',
        countryName: 'Russia',
        reason: 'Regional conflict sanctions',
        effectiveFrom: '2022-02-24T00:00:00Z',
        effectiveTo: null,
        enabled: false, // Disabled for demo
        createdAt: now,
        updatedAt: now
      }
    ];
    
    this.saveToStorage(seedData);
  }
}
