import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AccountProfileDto, CreateAccountProfileDto, UpdateAccountProfileDto } from '../models/account-profile.dto';
import { AccountProfileViewModel } from '../models/account-profile.view-model';
import { AccountProfileMapper } from '../mappers/account-profile.mapper';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * Account Profile Service
 * 
 * Manages user's per-account profiles.
 * Handles the relationship between a user and their accounts.
 */
@Injectable({ providedIn: 'root' })
export class AccountProfileService {
  
  // State signals
  private _profiles = signal<AccountProfileViewModel[]>([]);
  private _currentProfile = signal<AccountProfileViewModel | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly profiles = this._profiles.asReadonly();
  readonly currentProfile = this._currentProfile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signals
  readonly activeProfiles = computed(() => 
    this._profiles().filter(p => p.membershipStatus === 'active')
  );
  
  readonly accountIds = computed(() => 
    this._profiles().map(p => p.accountId)
  );
  
  private readonly apiUrl = '/api/authentication/account-profiles';
  
  constructor(
    private http: HttpClient,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }
  
  /**
   * Load all account profiles for current user
   */
  loadProfiles(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<AccountProfileDto[]>(this.apiUrl).pipe(
      map(dtos => AccountProfileMapper.toViewModels(dtos)),
      tap(profiles => {
        this._profiles.set(profiles);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to load account profiles');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }
  
  /**
   * Load profile for a specific account
   */
  loadProfileForAccount(accountId: string): Observable<AccountProfileViewModel | null> {
    return this.http.get<AccountProfileDto>(`${this.apiUrl}/account/${accountId}`).pipe(
      map(dto => AccountProfileMapper.toViewModel(dto)),
      tap(profile => this._currentProfile.set(profile)),
      catchError(err => {
        this._error.set('Failed to load account profile');
        return of(null);
      })
    );
  }
  
  /**
   * Set current account context
   */
  setCurrentAccount(accountId: string): void {
    const profile = this._profiles().find(p => p.accountId === accountId);
    this._currentProfile.set(profile || null);
    
    // Update last accessed
    if (profile) {
      this.updateLastAccessed(profile.id);
    }
  }
  
  /**
   * Update account profile
   */
  updateProfile(profileId: string, data: UpdateAccountProfileDto): Observable<AccountProfileViewModel | null> {
    return this.http.patch<AccountProfileDto>(`${this.apiUrl}/${profileId}`, data).pipe(
      map(dto => AccountProfileMapper.toViewModel(dto)),
      tap(profile => {
        if (profile) {
          this._profiles.update(list => 
            list.map(p => p.id === profileId ? profile : p)
          );
          if (this._currentProfile()?.id === profileId) {
            this._currentProfile.set(profile);
          }
        }
      }),
      catchError(err => {
        this._error.set('Failed to update profile');
        return of(null);
      })
    );
  }
  
  /**
   * Add item to favorites
   */
  addFavorite(itemId: string): Observable<boolean> {
    const profile = this._currentProfile();
    if (!profile) return of(false);
    
    const newFavorites = [...profile.favoriteItemIds, itemId];
    return this.updateProfile(profile.id, { favoriteItemIds: newFavorites }).pipe(
      map(p => p !== null)
    );
  }
  
  /**
   * Remove item from favorites
   */
  removeFavorite(itemId: string): Observable<boolean> {
    const profile = this._currentProfile();
    if (!profile) return of(false);
    
    const newFavorites = profile.favoriteItemIds.filter(id => id !== itemId);
    return this.updateProfile(profile.id, { favoriteItemIds: newFavorites }).pipe(
      map(p => p !== null)
    );
  }
  
  /**
   * Check if item is favorited
   */
  isFavorite(itemId: string): boolean {
    return this._currentProfile()?.favoriteItemIds.includes(itemId) || false;
  }
  
  /**
   * Update last accessed timestamp
   */
  private updateLastAccessed(profileId: string): void {
    this.http.patch(`${this.apiUrl}/${profileId}/accessed`, {}).subscribe();
  }
}
