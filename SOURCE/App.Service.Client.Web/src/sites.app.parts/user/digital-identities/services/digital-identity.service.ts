import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { DigitalIdentityDto, LinkDigitalIdentityDto, IDENTITY_PROVIDERS } from '../models/digital-identity.dto';
import { DigitalIdentityViewModel } from '../models/digital-identity.view-model';
import { DigitalIdentityMapper } from '../mappers/digital-identity.mapper';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * Digital Identity Service
 * 
 * Manages user's linked identity providers (federation/SSO).
 */
@Injectable({ providedIn: 'root' })
export class DigitalIdentityService {
  
  // State signals
  private _identities = signal<DigitalIdentityViewModel[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly identities = this._identities.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signals
  readonly primaryIdentity = computed(() => 
    this._identities().find(i => i.isPrimary) || null
  );
  
  readonly linkedProviderIds = computed(() => 
    this._identities().map(i => i.providerId)
  );
  
  readonly availableProviders = computed(() => 
    IDENTITY_PROVIDERS.filter(p => 
      p.enabled && !this.linkedProviderIds().includes(p.id)
    )
  );
  
  private readonly apiUrl = '/api/authentication/digital-identities';
  
  constructor(
    private http: HttpClient,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }
  
  /**
   * Load identities for current user
   */
  loadIdentities(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<DigitalIdentityDto[]>(this.apiUrl).pipe(
      map(dtos => DigitalIdentityMapper.toViewModels(dtos)),
      tap(identities => {
        this._identities.set(identities);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to load linked identities');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }
  
  /**
   * Load identities for a specific user (admin use)
   */
  loadIdentitiesForUser(userId: string): Observable<DigitalIdentityViewModel[]> {
    return this.http.get<DigitalIdentityDto[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      map(dtos => DigitalIdentityMapper.toViewModels(dtos)),
      catchError(err => {
        this._error.set('Failed to load user identities');
        return of([]);
      })
    );
  }
  
  /**
   * Link a new identity provider
   * Note: Actual OAuth flow would be handled separately
   */
  linkIdentity(data: LinkDigitalIdentityDto): Observable<DigitalIdentityViewModel | null> {
    return this.http.post<DigitalIdentityDto>(this.apiUrl, data).pipe(
      map(dto => DigitalIdentityMapper.toViewModel(dto)),
      tap(identity => {
        if (identity) {
          this._identities.update(list => [...list, identity]);
        }
      }),
      catchError(err => {
        this._error.set('Failed to link identity');
        return of(null);
      })
    );
  }
  
  /**
   * Unlink an identity provider
   */
  unlinkIdentity(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._identities.update(list => list.filter(i => i.id !== id));
      }),
      map(() => true),
      catchError(err => {
        this._error.set('Failed to unlink identity');
        return of(false);
      })
    );
  }
  
  /**
   * Set an identity as primary
   */
  setPrimaryIdentity(id: string): Observable<boolean> {
    return this.http.patch<DigitalIdentityDto>(`${this.apiUrl}/${id}/primary`, {}).pipe(
      tap(() => {
        this._identities.update(list => 
          list.map(i => ({ ...i, isPrimary: i.id === id }))
        );
      }),
      map(() => true),
      catchError(err => {
        this._error.set('Failed to set primary identity');
        return of(false);
      })
    );
  }
}
