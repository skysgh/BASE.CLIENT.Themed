/**
 * Profile Hub Component
 * 
 * Central hub for user profile management.
 * Shows tiles for different profile sections (Personal, Security, etc.)
 * 
 * Key differences from Settings:
 * - Profile = "Who I am" (identity, bio, credentials)
 * - Settings = "How things work" (preferences, config)
 * - Profile is always user-scoped (no service/account level selector)
 * - Account admins can LOCK profile fields (shown with lock indicators)
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { AccountService } from '../../../../../core/services/account.service';

interface ProfileTile {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  iconBackground: string;
  iconClass: string;
  route: string;
  /** Whether this tile is enabled (from config) */
  enabled: boolean;
  /** Whether any fields in this section are locked by account */
  hasLockedFields: boolean;
}

@Component({
  selector: 'app-profile-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, BaseCoreAgPipesModule],
  template: `
    <div class="profile-hub">
      <!-- Page Header -->
      <app-page-header 
        title="Profile"
        icon="bx-user-circle"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        backFallback="system/hub">
        <ng-container subtitle>{{ 'BASE.PROFILE.HUB.DESCRIPTION' | baseTranslate }}</ng-container>
      </app-page-header>

      <!-- Profile Tiles -->
      <div class="row g-3">
        @for (tile of tiles(); track tile.id) {
          @if (tile.enabled) {
            <div class="col-md-6 col-lg-4">
              <a [routerLink]="tile.route" class="profile-tile card h-100">
                <div class="card-body">
                  <div class="d-flex align-items-start">
                    <div class="tile-icon me-3 {{ tile.iconBackground }}">
                      <i class="bx {{ tile.icon }} {{ tile.iconClass }}"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-1">
                        <h5 class="mb-0">{{ tile.titleKey | baseTranslate }}</h5>
                        @if (tile.hasLockedFields) {
                          <i class="bx bx-lock-alt text-warning ms-2" 
                             title="Some fields are locked by account administrator"></i>
                        }
                      </div>
                      <p class="text-muted mb-0 small">{{ tile.descriptionKey | baseTranslate }}</p>
                    </div>
                    <i class="bx bx-chevron-right text-muted align-self-center"></i>
                  </div>
                </div>
              </a>
            </div>
          }
        }
      </div>

      <!-- Empty state if no tiles -->
      @if (tiles().filter(t => t.enabled).length === 0) {
        <div class="text-center py-5">
          <i class="bx bx-user-circle display-1 text-muted"></i>
          <h5 class="text-muted mt-3">No profile sections available</h5>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-hub {
      padding: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .profile-tile {
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    .tile-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
  `]
})
export class ProfileHubComponent implements OnInit {
  private accountService = inject(AccountService);
  
  tiles = signal<ProfileTile[]>([]);
  
  ngOnInit(): void {
    this.buildTiles();
  }
  
  private buildTiles(): void {
    const config = this.accountService.getCurrentConfig();
    
    // Check which fields are locked
    // TODO: Add profile.lockedFields to AccountConfig interface
    const lockedFields = (config as any)?.profile?.lockedFields || [];
    
    const baseTiles: ProfileTile[] = [
      {
        id: 'personal',
        titleKey: 'BASE.PROFILE.PERSONAL.TITLE',
        descriptionKey: 'BASE.PROFILE.PERSONAL.DESCRIPTION',
        icon: 'bx-user',
        iconBackground: 'bg-primary-subtle',
        iconClass: 'text-primary',
        route: '/system/profile/personal',
        enabled: true,
        hasLockedFields: this.hasLockedFieldsIn(lockedFields, ['avatar', 'displayName', 'bio', 'firstName', 'lastName'])
      },
      {
        id: 'security',
        titleKey: 'BASE.PROFILE.SECURITY.TITLE',
        descriptionKey: 'BASE.PROFILE.SECURITY.DESCRIPTION',
        icon: 'bx-shield-quarter',
        iconBackground: 'bg-success-subtle',
        iconClass: 'text-success',
        route: '/system/profile/security',
        enabled: true,
        hasLockedFields: this.hasLockedFieldsIn(lockedFields, ['password', 'mfa', 'sessions'])
      }
    ];
    
    // Future: Add applet-registered profile tiles here
    // e.g., if (config?.applets?.health?.enabled) { add health profile tile }
    
    this.tiles.set(baseTiles);
  }
  
  private hasLockedFieldsIn(lockedFields: string[], fieldNames: string[]): boolean {
    return fieldNames.some(field => lockedFields.includes(field));
  }
}
