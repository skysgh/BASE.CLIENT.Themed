/**
 * Topbar Trash Component
 * 
 * Trash icon in topbar with badge showing count of deleted items.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TrashService } from '../../../../../sites.app.parts/trash/services/trash.service';

@Component({
  selector: 'app-base-common-components-topbar-trash',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="header-item">
      <a routerLink="/system/trash" 
         class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
         title="Trash">
        <i class="bx bx-trash fs-22"></i>
        @if (trashService.count() > 0) {
          <span class="position-absolute topbar-badge badge rounded-pill bg-danger">
            {{ trashService.count() > 99 ? '99+' : trashService.count() }}
          </span>
        }
      </a>
    </div>
  `,
  styles: [`
    .header-item {
      position: relative;
    }
    
    .topbar-badge {
      top: 0;
      right: 0;
      font-size: 0.625rem;
      padding: 0.15rem 0.35rem;
    }
  `]
})
export class TopbarTrashComponent implements OnInit {
  trashService = inject(TrashService);
  
  ngOnInit(): void {
    // Load trash count on init
    this.trashService.loadDeletedItems();
  }
}
