import { Injectable } from '@angular/core';

/**
 * ServiceAccountService
 *
 * Represents a ServiceAccount (organizational account), not a PersonAccount.
 * This service provides the account GUID for database queries.
 *
 * Note: This is separate from AccountService which handles configuration.
 * - AccountService: Handles account detection, config loading, branding
 * - ServiceAccountService: Provides account GUID for database queries
 *
 * In multi-account architecture:
 * - AccountService detects account ID from URL ('foo', 'bar')
 * - ServiceAccountService provides the corresponding GUID for that account
 * - Components inject AccountService for config/branding
 * - Repositories inject ServiceAccountService for database queries
 *
 * Integration: AccountService should populate this service's GUID
 * when it loads account configuration.
 */
@Injectable({ providedIn: 'root' })
export class ServiceAccountService {
  /**
   * Current account GUID (for database queries)
   * Default: '00000000-0000-0000-0000-000000000001'
   *
   * This is populated by AccountService when it loads account config
   */
  public id: string = '00000000-0000-0000-0000-000000000001';

  /**
   * Set account GUID
   * @param guid Account GUID
   */
  setAccountGuid(guid: string): void {
    this.id = guid;
  }

  /**
   * Get account GUID
   * @returns Account GUID
   */
  getAccountGuid(): string {
    return this.id;
  }
}
