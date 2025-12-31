/**
 * Account Info Component
 * 
 * Displays information about the current account/organization/tenant.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AccountInfo {
  name?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  region?: string;
  plan?: string;
  subscriptionStatus?: string;
  createdAt?: string;
  contactEmail?: string;
}

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
            <i class="bx bx-arrow-back"></i>
          </a>
          <h4 class="d-inline-block mb-0">
            <i class="bx bx-building me-2 text-warning"></i>
            Account Information
          </h4>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <!-- Account Info -->
      <div *ngIf="!loading() && accountInfo() as account">
        
        <!-- Account Header -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center mb-4">
              <div class="account-logo me-4">
                <img *ngIf="account.logo" 
                     [src]="account.logo" 
                     [alt]="account.name"
                     class="img-fluid"
                     style="max-height: 80px;">
                <div *ngIf="!account.logo" class="logo-placeholder">
                  <i class="bx bx-building fs-48"></i>
                </div>
              </div>
              <div>
                <h3 class="mb-1">{{ account.name }}</h3>
                <p class="text-muted mb-0">
                  Your Organization
                  <span *ngIf="account.plan" class="badge bg-primary ms-2">
                    {{ account.plan }}
                  </span>
                  <span *ngIf="account.subscriptionStatus" 
                        class="badge ms-2"
                        [class.bg-success]="account.subscriptionStatus === 'Active'"
                        [class.bg-warning]="account.subscriptionStatus !== 'Active'">
                    {{ account.subscriptionStatus }}
                  </span>
                </p>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted mb-3">Organization Details</h6>
                <table class="table table-borderless table-sm">
                  <tbody>
                    <tr *ngIf="account.industry">
                      <td class="text-muted" style="width: 120px;">Industry</td>
                      <td>{{ account.industry }}</td>
                    </tr>
                    <tr *ngIf="account.size">
                      <td class="text-muted">Size</td>
                      <td>{{ account.size }}</td>
                    </tr>
                    <tr *ngIf="account.region">
                      <td class="text-muted">Region</td>
                      <td>{{ account.region }}</td>
                    </tr>
                    <tr *ngIf="account.createdAt">
                      <td class="text-muted">Member Since</td>
                      <td>{{ formatDate(account.createdAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted mb-3">Contact</h6>
                <ul class="list-unstyled">
                  <li *ngIf="account.website" class="mb-2">
                    <a [href]="account.website" target="_blank" class="text-decoration-none">
                      <i class="bx bx-globe me-2 text-warning"></i>
                      {{ account.website }}
                    </a>
                  </li>
                  <li *ngIf="account.contactEmail" class="mb-2">
                    <a [href]="'mailto:' + account.contactEmail" class="text-decoration-none">
                      <i class="bx bx-envelope me-2 text-warning"></i>
                      {{ account.contactEmail }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bx bx-cog fs-32 text-primary mb-2"></i>
                <h6>Settings</h6>
                <p class="text-muted small mb-0">Manage account settings</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bx bx-group fs-32 text-info mb-2"></i>
                <h6>Users</h6>
                <p class="text-muted small mb-0">Manage team members</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bx bx-credit-card fs-32 text-success mb-2"></i>
                <h6>Billing</h6>
                <p class="text-muted small mb-0">Subscription & invoices</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Navigation -->
      <div class="d-flex justify-content-between mt-4">
        <a routerLink="../distributor" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Previous: Distributor
        </a>
        <a routerLink="../" class="btn btn-outline-primary">
          Back to About
          <i class="bx bx-arrow-right ms-1"></i>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .account-page { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    
    .logo-placeholder {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #ee0979, #ff6a00);
      color: white;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AccountInfoComponent implements OnInit {
  private accountService = inject(AccountService);
  
  loading = signal(true);
  accountInfo = signal<AccountInfo | null>(null);

  ngOnInit(): void {
    this.loadAccountInfo();
  }

  private loadAccountInfo(): void {
    // Load account configuration values
    forkJoin({
      name: this.accountService.getConfigValue<string>('account.name').pipe(catchError(() => of('My Organization'))),
      logo: this.accountService.getConfigValue<string>('account.logo').pipe(catchError(() => of(undefined))),
      website: this.accountService.getConfigValue<string>('account.website').pipe(catchError(() => of(undefined))),
      industry: this.accountService.getConfigValue<string>('account.industry').pipe(catchError(() => of(undefined))),
      size: this.accountService.getConfigValue<string>('account.size').pipe(catchError(() => of(undefined))),
      region: this.accountService.getConfigValue<string>('account.region').pipe(catchError(() => of(undefined))),
      plan: this.accountService.getConfigValue<string>('account.plan').pipe(catchError(() => of('Standard'))),
      subscriptionStatus: this.accountService.getConfigValue<string>('account.subscriptionStatus').pipe(catchError(() => of('Active'))),
      createdAt: this.accountService.getConfigValue<string>('account.createdAt').pipe(catchError(() => of(undefined))),
      contactEmail: this.accountService.getConfigValue<string>('account.contactEmail').pipe(catchError(() => of(undefined))),
    }).subscribe(info => {
      this.accountInfo.set(info);
      this.loading.set(false);
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
}
