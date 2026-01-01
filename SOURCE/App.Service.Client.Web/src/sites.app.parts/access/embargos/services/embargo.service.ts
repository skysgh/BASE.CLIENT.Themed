/**
 * Embargo Service
 * 
 * Business logic and state management for embargoes.
 * Provides reactive signals for UI components.
 */
import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { EmbargoRepository } from '../repositories/embargo.repository';
import { EmbargoDto, CreateEmbargoDto, UpdateEmbargoDto } from '../models/embargo.dto';
import { EmbargoViewModel, EmbargoStats } from '../models/embargo.view-model';
import { mapEmbargoToViewModel, mapEmbargosToViewModels, calculateEmbargoStats } from '../mappers/embargo.mapper';

@Injectable({ providedIn: 'root' })
export class EmbargoService {
  
  // === State Signals ===
  
  /** All embargoes */
  embargos = signal<EmbargoViewModel[]>([]);
  
  /** Loading state */
  loading = signal(false);
  
  /** Error message */
  error = signal<string | null>(null);
  
  /** Currently selected embargo for detail view */
  selected = signal<EmbargoViewModel | null>(null);
  
  // === Computed Values ===
  
  /** Only active embargoes */
  activeEmbargos = computed(() => 
    this.embargos().filter(e => e.status === 'active')
  );
  
  /** Country codes that are embargoed */
  embargoedCountryCodes = computed(() => 
    this.activeEmbargos().map(e => e.countryCode)
  );
  
  /** Statistics for dashboard */
  stats = computed(() => 
    calculateEmbargoStats(this.embargos())
  );
  
  /** Total active count for widgets */
  activeCount = computed(() => this.stats().active);
  
  /** Available countries count for widgets */
  availableCount = computed(() => this.stats().availableCountries);
  
  constructor(private repository: EmbargoRepository) {
    // Load on init
    this.loadAll();
  }
  
  // === Public Methods ===
  
  /**
   * Load all embargoes
   */
  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          this.embargos.set(mapEmbargosToViewModels(dtos));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load embargoes');
          this.loading.set(false);
          console.error('[EmbargoService] Load error:', err);
        }
      })
    ).subscribe();
  }
  
  /**
   * Load single embargo by ID
   */
  loadById(id: string): Observable<EmbargoViewModel | null> {
    this.loading.set(true);
    
    return this.repository.getById(id).pipe(
      map(dto => dto ? mapEmbargoToViewModel(dto) : null),
      tap({
        next: (vm) => {
          this.selected.set(vm);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      })
    );
  }
  
  /**
   * Check if a country is embargoed
   */
  isCountryEmbargoed(countryCode: string): boolean {
    return this.embargoedCountryCodes().includes(countryCode.toUpperCase());
  }
  
  /**
   * Create new embargo
   */
  create(dto: CreateEmbargoDto): Observable<EmbargoViewModel> {
    this.loading.set(true);
    
    return this.repository.create(dto).pipe(
      map(mapEmbargoToViewModel),
      tap({
        next: (vm) => {
          this.embargos.update(list => [...list, vm]);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to create embargo');
          this.loading.set(false);
        }
      })
    );
  }
  
  /**
   * Update embargo
   */
  update(id: string, dto: UpdateEmbargoDto): Observable<EmbargoViewModel | null> {
    this.loading.set(true);
    
    return this.repository.update(id, dto).pipe(
      map(result => result ? mapEmbargoToViewModel(result) : null),
      tap({
        next: (vm) => {
          if (vm) {
            this.embargos.update(list => 
              list.map(e => e.id === id ? vm : e)
            );
            this.selected.set(vm);
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to update embargo');
          this.loading.set(false);
        }
      })
    );
  }
  
  /**
   * Toggle embargo enabled/disabled
   */
  toggle(id: string): Observable<EmbargoViewModel | null> {
    return this.repository.toggle(id).pipe(
      map(result => result ? mapEmbargoToViewModel(result) : null),
      tap({
        next: (vm) => {
          if (vm) {
            this.embargos.update(list => 
              list.map(e => e.id === id ? vm : e)
            );
          }
        }
      })
    );
  }
  
  /**
   * Delete embargo
   */
  delete(id: string): Observable<boolean> {
    return this.repository.delete(id).pipe(
      tap({
        next: (success) => {
          if (success) {
            this.embargos.update(list => list.filter(e => e.id !== id));
            if (this.selected()?.id === id) {
              this.selected.set(null);
            }
          }
        }
      })
    );
  }
  
  /**
   * Refresh data
   */
  refresh(): void {
    this.loadAll();
  }
}
