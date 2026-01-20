/**
 * Person Service
 * 
 * Signal-based service for Person entity management.
 * 
 * Person is THIN:
 * - id
 * - identifiers[] (Value Objects)
 * - location (Value Object)
 * 
 * Architecture: Repository (HTTP) → Service (signals) → Component
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { PersonRepository } from '../repositories';
import { Person, PersonIdentifier, PersonIdentifierType, getPersonDisplayName } from '../models';
import { PersonDto } from '../models/dtos';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private repository = inject(PersonRepository);
  private logger = inject(SystemDiagnosticsTraceService);
  
  // Signals
  private _people = signal<Person[]>([]);
  private _identifierTypes = signal<PersonIdentifierType[]>([]);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly
  readonly people = this._people.asReadonly();
  readonly identifierTypes = this._identifierTypes.asReadonly();
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
   * Get person by email identifier
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
      identifiers: data.identifiers || [],
      location: data.location,
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
          this.logger.debug(`Created person: ${getPersonDisplayName(created)}`);
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
    
     const baseDto = this.mapPersonToDto(existing);
     const dto: PersonDto = {
       id: baseDto.id,
       identifiers: updates.identifiers ?? baseDto.identifiers,
       location: updates.location ?? baseDto.location,
       isActive: updates.isActive ?? baseDto.isActive,
       createdUtc: baseDto.createdUtc,
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
           this.logger.debug(`Updated person: ${getPersonDisplayName(updated)}`);
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
  // Identifier Operations
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Add an identifier to a person
   */
  addIdentifier(personId: string, identifier: PersonIdentifier): Observable<Person | undefined> {
    const person = this._people().find(p => p.id === personId);
    if (!person) return of(undefined);
    
    const updatedIdentifiers = [...person.identifiers, identifier];
    return this.update(personId, { identifiers: updatedIdentifiers });
  }
  
  /**
   * Remove an identifier from a person
   */
  removeIdentifier(personId: string, typeId: string, value: string): Observable<Person | undefined> {
    const person = this._people().find(p => p.id === personId);
    if (!person) return of(undefined);
    
    const updatedIdentifiers = person.identifiers.filter(
      i => !(i.typeId === typeId && i.value === value)
    );
    return this.update(personId, { identifiers: updatedIdentifiers });
  }
  
  /**
   * Get display name for a person
   */
  getDisplayName(person: Person): string {
    return getPersonDisplayName(person);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Mappers
  // ─────────────────────────────────────────────────────────────────
  
  private mapDtoToPerson(dto: PersonDto): Person {
    return {
      id: dto.id,
      identifiers: dto.identifiers || [],
      location: dto.location,
      isActive: dto.isActive,
      createdUtc: dto.createdUtc ? new Date(dto.createdUtc) : undefined,
      modifiedUtc: dto.modifiedUtc ? new Date(dto.modifiedUtc) : undefined,
    };
  }
  
  private mapPersonToDto(person: Person): PersonDto {
    return {
      id: person.id,
      identifiers: person.identifiers,
      location: person.location,
      isActive: person.isActive,
      createdUtc: person.createdUtc?.toISOString(),
      modifiedUtc: person.modifiedUtc?.toISOString(),
    };
  }
}
