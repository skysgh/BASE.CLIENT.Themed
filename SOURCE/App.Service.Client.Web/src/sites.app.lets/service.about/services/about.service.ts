/**
 * About Service
 * 
 * Provides information about the service, including:
 * - Creator/Developer info
 * - Distributor/Partner info
 * - Version and build info
 * - Open source license attributions
 * 
 * Data sources:
 * - Static JSON files in assets/data/service/
 * - Environment configuration
 * - Package.json (for version)
 */
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { 
  LicenseDto, 
  CreatorInfoDto, 
  DistributorInfoDto, 
  VersionInfoDto,
  AboutInfoDto 
} from '../models/about.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AboutService {
  
  // Signals for reactive state
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _creator = signal<CreatorInfoDto | null>(null);
  private _distributor = signal<DistributorInfoDto | null>(null);
  private _version = signal<VersionInfoDto | null>(null);
  private _licenses = signal<LicenseDto[]>([]);

  // Public readonly signals
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  creator = this._creator.asReadonly();
  distributor = this._distributor.asReadonly();
  version = this._version.asReadonly();
  licenses = this._licenses.asReadonly();

  // Computed
  hasDistributor = computed(() => this._distributor() !== null);
  licenseCount = computed(() => this._licenses().length);

  // Data file paths
  private readonly dataPath = 'assets/data/service';

  constructor(
    private http: HttpClient,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadAll();
  }

  /**
   * Load all about information
   */
  loadAll(): void {
    this._loading.set(true);
    this._error.set(null);

    forkJoin({
      creator: this.loadCreatorInfo(),
      distributor: this.loadDistributorInfo(),
      licenses: this.loadLicenses(),
    }).subscribe({
      next: (result) => {
        this._creator.set(result.creator);
        this._distributor.set(result.distributor);
        this._licenses.set(result.licenses);
        this._version.set(this.getVersionInfo());
        this._loading.set(false);
        this.logger.info('About info loaded successfully');
      },
      error: (err) => {
        this._error.set('Failed to load about information');
        this._loading.set(false);
        this.logger.error(`Error loading about info: ${err?.message || err}`);
      }
    });
  }

  /**
   * Load creator info from JSON
   */
  private loadCreatorInfo(): Observable<CreatorInfoDto> {
    return this.http.get<CreatorInfoDto>(`${this.dataPath}/creator.json`).pipe(
      catchError(() => of(this.getDefaultCreatorInfo()))
    );
  }

  /**
   * Load distributor info from JSON (may not exist)
   */
  private loadDistributorInfo(): Observable<DistributorInfoDto | null> {
    return this.http.get<DistributorInfoDto>(`${this.dataPath}/distributor.json`).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Load licenses from JSON
   */
  private loadLicenses(): Observable<LicenseDto[]> {
    return this.http.get<LicenseDto[]>(`${this.dataPath}/licenses.json`).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Get version info from environment and package
   */
  private getVersionInfo(): VersionInfoDto {
    return {
      version: (environment as any).version || '1.0.0',
      buildNumber: (environment as any).buildNumber || 'local',
      buildDate: (environment as any).buildDate || new Date().toISOString(),
      commitHash: (environment as any).commitHash || 'unknown',
      environment: environment.production ? 'production' : 'development',
      angularVersion: '17.x', // Could be dynamic
      nodeVersion: (environment as any).nodeVersion || 'unknown',
    };
  }

  /**
   * Default creator info (fallback)
   */
  private getDefaultCreatorInfo(): CreatorInfoDto {
    return {
      name: 'BASE Platform',
      description: 'A modern enterprise application platform',
      copyright: `© ${new Date().getFullYear()} BASE Platform. All rights reserved.`,
      website: 'https://example.com',
    };
  }

  /**
   * Get grouped licenses by license type
   */
  getLicensesByType(): Map<string, LicenseDto[]> {
    const grouped = new Map<string, LicenseDto[]>();
    
    for (const license of this._licenses()) {
      const type = license.license || 'Unknown';
      if (!grouped.has(type)) {
        grouped.set(type, []);
      }
      grouped.get(type)!.push(license);
    }
    
    return grouped;
  }

  /**
   * Search licenses by name
   */
  searchLicenses(query: string): LicenseDto[] {
    if (!query) return this._licenses();
    
    const lowerQuery = query.toLowerCase();
    return this._licenses().filter(l => 
      l.name.toLowerCase().includes(lowerQuery) ||
      l.license.toLowerCase().includes(lowerQuery)
    );
  }
}
