/**
 * Browse Pagination Component
 * 
 * Page navigation controls.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-browse-pagination',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="browse-pagination mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Page Info -->
        <div class="text-muted small">
          Showing {{ startItem }} to {{ endItem }} of {{ totalCount }}
        </div>
        
        <!-- Page Controls -->
        <nav aria-label="Browse pagination">
          <ul class="pagination pagination-sm mb-0">
            <!-- Previous -->
            <li class="page-item" [class.disabled]="page <= 1">
              @if (page > 1) {
                <a class="page-link" (click)="goToPage(page - 1)">
                  <i class="bx bx-chevron-left"></i>
                </a>
              } @else {
                <span class="page-link">
                  <i class="bx bx-chevron-left"></i>
                </span>
              }
            </li>
            
            <!-- Page Numbers -->
            @for (p of visiblePages; track p) {
              @if (p === '...') {
                <li class="page-item disabled">
                  <span class="page-link">...</span>
                </li>
              } @else {
                <li class="page-item" [class.active]="page === p">
                  <a class="page-link" (click)="goToPage(+p)">{{ p }}</a>
                </li>
              }
            }
            
            <!-- Next -->
            <li class="page-item" [class.disabled]="page >= totalPages">
              @if (page < totalPages) {
                <a class="page-link" (click)="goToPage(page + 1)">
                  <i class="bx bx-chevron-right"></i>
                </a>
              } @else {
                <span class="page-link">
                  <i class="bx bx-chevron-right"></i>
                </span>
              }
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .browse-pagination {
      border-top: 1px solid var(--vz-border-color);
      padding-top: 1rem;
    }
    
    .page-link {
      cursor: pointer;
    }
    
    .page-item.disabled .page-link {
      cursor: not-allowed;
    }
  `]
})
export class BrowsePaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalCount = 0;
  @Input() totalPages = 1;
  
  @Output() pageChange = new EventEmitter<number>();
  
  get startItem(): number {
    return (this.page - 1) * this.pageSize + 1;
  }
  
  get endItem(): number {
    const end = this.page * this.pageSize;
    return end > this.totalCount ? this.totalCount : end;
  }
  
  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.page;
    
    if (total <= 7) {
      // Show all pages
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and around current
      pages.push(1);
      
      if (current > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push('...');
      }
      
      pages.push(total);
    }
    
    return pages;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      this.pageChange.emit(page);
    }
  }
}
