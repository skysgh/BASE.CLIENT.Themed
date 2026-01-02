import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-insights',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-insights">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-bar-chart-alt-2 me-2 text-info"></i>User Insights</h4>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">User Growth</h6></div>
            <div class="card-body" style="height: 250px;">
              <p class="text-muted text-center mt-5">[Chart: User growth over time]</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">Status Distribution</h6></div>
            <div class="card-body" style="height: 250px;">
              <p class="text-muted text-center mt-5">[Chart: Users by status]</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">Role Distribution</h6></div>
            <div class="card-body" style="height: 250px;">
              <p class="text-muted text-center mt-5">[Chart: Users by role]</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header"><h6 class="mb-0">Activity Trends</h6></div>
            <div class="card-body" style="height: 250px;">
              <p class="text-muted text-center mt-5">[Chart: Login activity]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.users-insights { padding: 1.5rem; }`]
})
export class UsersInsightsComponent {}
