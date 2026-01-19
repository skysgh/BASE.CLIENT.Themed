/**
 * Person Service
 * 
 * Signal-based service for Person entity management.
 * Architecture: Repository (HTTP) → Service (signals) → Component
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { PersonRepository } from '../repositories';
import { Person } from '../models';
import { PersonDto } from '../models/dtos';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private repository = inject(PersonRepository);
  private logger = inject(SystemDiagnosticsTraceService);
  
  // Signals
  private _people = signal<Person[]>([]);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly
  readonly people = this._people.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed
  readonly personCount = computed(() => this._people().length);
  
  constructor() {
    this.logger.debug('PersonService initialized');
  }
  
  // ─────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Load all people from API
   */
  loadPeople(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const people = dtos.map(dto => this.mapDtoToPerson(dto));
          this._people.set(people);
          this._loading.set(false);
          this.logger.debug(`Loaded ${people.length} people from API`);
        },
        error: (err) => {
          this._error.set('Failed to load people');
          this._loading.set(false);
          this.logger.error(`Error loading people: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  /**
   * Get person by ID
   */
  getById(id: string): Observable<Person | undefined> {
    // Check cache first
    const cached = this._people().find(p => p.id === id);
    if (cached) {
      return of(cached);
    }
    
    return this.repository.getById(id).pipe(
      map(dto => this.mapDtoToPerson(dto)),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Get person by email
   */
  getByEmail(email: string): Observable<Person | undefined> {
    return this.repository.getByEmail(email).pipe(
      map(dtos => dtos.length > 0 ? this.mapDtoToPerson(dtos[0]) : undefined),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Create a new person
   */
  create(data: Partial<Person>): Observable<Person> {
    this._saving.set(true);
    
    const now = new Date().toISOString();
    const dto: PersonDto = {
      id: `person-${Date.now()}`,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      preferredName: data.preferredName,
      email: data.email || '',
      phone: data.phone,
      title: data.title,
      organization: data.organization,
      department: data.department,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      timezone: data.timezone,
      locale: data.locale,
      isActive: true,
      createdUtc: now,
      modifiedUtc: now,
    };
    
    return this.repository.create(dto).pipe(
      map(savedDto => this.mapDtoToPerson(savedDto)),
      tap({
        next: (created) => {
          this._people.update(people => [...people, created]);
          this._saving.set(false);
          this.logger.debug(`Created person: ${created.firstName} ${created.lastName}`);
        },
        error: (err) => {
          this._error.set('Failed to create person');
          this._saving.set(false);
          this.logger.error(`Error creating person: ${err?.message || err}`);
        }
      })
    );
  }
  
  /**
   * Update an existing person
   */
  update(id: string, updates: Partial<Person>): Observable<Person | undefined> {
    this._saving.set(true);
    
    const existing = this._people().find(p => p.id === id);
    if (!existing) {
      this._saving.set(false);
      return of(undefined);
    }
    
    const dto: PersonDto = {
      ...this.mapPersonToDto(existing),
      ...this.mapPartialToDto(updates),
      modifiedUtc: new Date().toISOString(),
    };
    
    return this.repository.update(id, dto).pipe(
      map(savedDto => this.mapDtoToPerson(savedDto)),
      tap({
        next: (updated) => {
          this._people.update(people => 
            people.map(p => p.id === id ? updated : p)
          );
          this._saving.set(false);
          this.logger.debug(`Updated person: ${updated.firstName} ${updated.lastName}`);
        },
        error: (err) => {
          this._error.set('Failed to update person');
          this._saving.set(false);
          this.logger.error(`Error updating person: ${err?.message || err}`);
        }
      }),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Delete a person
   */
  delete(id: string): Observable<boolean> {
    this._saving.set(true);
    
    return this.repository.delete(id).pipe(
      map(() => true),
      tap({
        next: () => {
          this._people.update(people => people.filter(p => p.id !== id));
          this._saving.set(false);
          this.logger.debug(`Deleted person: ${id}`);
        },
        error: (err) => {
          this._error.set('Failed to delete person');
          this._saving.set(false);
          this.logger.error(`Error deleting person: ${err?.message || err}`);
        }
      }),
      catchError(() => of(false))
    );
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Mappers
  // ─────────────────────────────────────────────────────────────────
  
  private mapDtoToPerson(dto: PersonDto): Person {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      preferredName: dto.preferredName,
      fullName: `${dto.firstName} ${dto.lastName}`.trim(),
      email: dto.email,
      emailVerified: dto.emailVerified,
      phone: dto.phone,
      title: dto.title,
      organization: dto.organization,
      department: dto.department,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      timezone: dto.timezone,
      locale: dto.locale,
      isActive: dto.isActive,
      createdUtc: dto.createdUtc ? new Date(dto.createdUtc) : undefined,
      modifiedUtc: dto.modifiedUtc ? new Date(dto.modifiedUtc) : undefined,
    };
  }
  
  private mapPersonToDto(person: Person): PersonDto {
    return {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      preferredName: person.preferredName,
      email: person.email,
      emailVerified: person.emailVerified,
      phone: person.phone,
      title: person.title,
      organization: person.organization,
      department: person.department,
      bio: person.bio,
      avatarUrl: person.avatarUrl,
      timezone: person.timezone,
      locale: person.locale,
      isActive: person.isActive,
      createdUtc: person.createdUtc?.toISOString(),
      modifiedUtc: person.modifiedUtc?.toISOString(),
    };
  }
  
  private mapPartialToDto(updates: Partial<Person>): Partial<PersonDto> {
    const dto: Partial<PersonDto> = {};
    if (updates.firstName !== undefined) dto.firstName = updates.firstName;
    if (updates.lastName !== undefined) dto.lastName = updates.lastName;
    if (updates.preferredName !== undefined) dto.preferredName = updates.preferredName;
    if (updates.email !== undefined) dto.email = updates.email;
    if (updates.phone !== undefined) dto.phone = updates.phone;
    if (updates.title !== undefined) dto.title = updates.title;
    if (updates.organization !== undefined) dto.organization = updates.organization;
    if (updates.department !== undefined) dto.department = updates.department;
    if (updates.bio !== undefined) dto.bio = updates.bio;
    if (updates.avatarUrl !== undefined) dto.avatarUrl = updates.avatarUrl;
    if (updates.timezone !== undefined) dto.timezone = updates.timezone;
    if (updates.locale !== undefined) dto.locale = updates.locale;
    return dto;
  }
}
