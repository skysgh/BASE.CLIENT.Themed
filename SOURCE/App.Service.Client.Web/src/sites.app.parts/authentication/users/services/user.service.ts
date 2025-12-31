import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { UserDto, CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { UserViewModel } from '../models/user.view-model';
import { UserMapper } from '../mappers/user.mapper';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * User Service
 * 
 * Manages user identity records.
 * Uses Angular signals for reactive state.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  
  // State signals
  private _users = signal<UserViewModel[]>([]);
  private _currentUser = signal<UserViewModel | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly users = this._users.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signals
  readonly activeUsers = computed(() => 
    this._users().filter(u => u.isCurrentlyValid)
  );
  
  readonly userCount = computed(() => this._users().length);
  
  // API endpoint (would come from config in production)
  private readonly apiUrl = '/api/authentication/users';
  
  constructor(
    private http: HttpClient,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }
  
  /**
   * Load all users
   */
  loadUsers(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<UserDto[]>(this.apiUrl).pipe(
      map(dtos => UserMapper.toViewModels(dtos)),
      tap(users => {
        this._users.set(users);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to load users');
        this._loading.set(false);
        this.diagnostics.error(`Failed to load users: ${err.message}`);
        return of([]);
      })
    ).subscribe();
  }
  
  /**
   * Load a specific user by ID
   */
  loadUser(id: string): Observable<UserViewModel | null> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`).pipe(
      map(dto => UserMapper.toViewModel(dto)),
      tap(user => this._currentUser.set(user)),
      catchError(err => {
        this._error.set('Failed to load user');
        this.diagnostics.error(`Failed to load user ${id}: ${err.message}`);
        return of(null);
      })
    );
  }
  
  /**
   * Create a new user
   */
  createUser(data: CreateUserDto): Observable<UserViewModel | null> {
    return this.http.post<UserDto>(this.apiUrl, data).pipe(
      map(dto => UserMapper.toViewModel(dto)),
      tap(user => {
        if (user) {
          this._users.update(users => [...users, user]);
        }
      }),
      catchError(err => {
        this._error.set('Failed to create user');
        this.diagnostics.error(`Failed to create user: ${err.message}`);
        return of(null);
      })
    );
  }
  
  /**
   * Update an existing user
   */
  updateUser(id: string, data: UpdateUserDto): Observable<UserViewModel | null> {
    return this.http.patch<UserDto>(`${this.apiUrl}/${id}`, data).pipe(
      map(dto => UserMapper.toViewModel(dto)),
      tap(user => {
        if (user) {
          this._users.update(users => 
            users.map(u => u.id === id ? user : u)
          );
          if (this._currentUser()?.id === id) {
            this._currentUser.set(user);
          }
        }
      }),
      catchError(err => {
        this._error.set('Failed to update user');
        this.diagnostics.error(`Failed to update user ${id}: ${err.message}`);
        return of(null);
      })
    );
  }
  
  /**
   * Disable a user (soft disable, not delete)
   */
  disableUser(id: string): Observable<boolean> {
    return this.updateUser(id, { enabled: false }).pipe(
      map(user => user !== null)
    );
  }
  
  /**
   * Enable a user
   */
  enableUser(id: string): Observable<boolean> {
    return this.updateUser(id, { enabled: true }).pipe(
      map(user => user !== null)
    );
  }
}
