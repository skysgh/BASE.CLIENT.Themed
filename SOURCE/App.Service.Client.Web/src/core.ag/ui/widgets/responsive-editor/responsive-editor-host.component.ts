/**
 * Responsive Editor Host
 * 
 * A universal container that presents editor content differently based on viewport:
 * - Desktop/Tablet: Slide-in panel (offcanvas)
 * - Mobile: Full-page route navigation
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ContentChild, 
  TemplateRef, 
  OnChanges, 
  SimpleChanges,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasRef, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BreakpointService, BreakpointMode } from '../../../../core/services/breakpoint.service';
import { ResponsiveEditorContentDirective } from './responsive-editor-content.directive';

export interface ResponsiveEditorConfig {
  panelWidth?: string;
  panelPosition?: 'start' | 'end';
  showBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  routeModeBreakpoint?: BreakpointMode;
}

const DEFAULT_CONFIG: ResponsiveEditorConfig = {
  panelWidth: '400px',
  panelPosition: 'end',
  showBackdrop: true,
  closeOnBackdrop: true,
  routeModeBreakpoint: 'mobile',
};

@Component({
  selector: 'app-responsive-editor-host',
  standalone: true,
  imports: [CommonModule, NgbOffcanvasModule],
  template: `
    <!-- Panel template for desktop/tablet -->
    <ng-template #panelTemplate let-offcanvas>
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title">{{ title }}</h5>
        <button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss()"></button>
      </div>
      <div class="offcanvas-body">
        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
      </div>
      <div class="offcanvas-footer border-top p-3 d-flex justify-content-end gap-2" *ngIf="showActions">
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="onCancel()">
          {{ cancelLabel }}
        </button>
        <button type="button" class="btn btn-primary btn-sm" (click)="onSave()">
          {{ saveLabel }}
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: contents;
    }
    .offcanvas-footer {
      background-color: var(--vz-card-bg);
    }
  `]
})
export class ResponsiveEditorHostComponent implements OnChanges, OnDestroy, AfterViewInit {
  /** Title shown in panel header */
  @Input() title = 'Edit';
  
  /** Route to navigate to on mobile (relative to current route) */
  @Input() mobileRoute: any[] = [];
  
  /** Whether the editor is open */
  @Input() isOpen = false;
  
  /** Configuration options */
  @Input() config: ResponsiveEditorConfig = {};
  
  /** Show save/cancel action buttons */
  @Input() showActions = true;
  
  /** Label for save button */
  @Input() saveLabel = 'Save';
  
  /** Label for cancel button */
  @Input() cancelLabel = 'Cancel';
  
  /** Emitted when editor is closed (by any means) */
  @Output() closed = new EventEmitter<void>();
  
  /** Emitted when save is clicked */
  @Output() saved = new EventEmitter<void>();
  
  /** Emitted when cancel is clicked */
  @Output() cancelled = new EventEmitter<void>();

  @ContentChild(ResponsiveEditorContentDirective, { read: TemplateRef }) 
  contentTemplate!: TemplateRef<any>;

  @ViewChild('panelTemplate') panelTemplate!: TemplateRef<any>;

  private offcanvasRef?: NgbOffcanvasRef;
  private breakpointSub?: Subscription;
  private mergedConfig: ResponsiveEditorConfig = DEFAULT_CONFIG;
  private viewInitialized = false;
  private pendingOpen = false;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointService: BreakpointService
  ) {}

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    // If open was requested before view init, do it now
    if (this.pendingOpen) {
      this.pendingOpen = false;
      setTimeout(() => this.open(), 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.mergedConfig = { ...DEFAULT_CONFIG, ...this.config };
    }
    
    if (changes['isOpen']) {
      if (this.isOpen) {
        if (this.viewInitialized) {
          this.open();
        } else {
          this.pendingOpen = true;
        }
      } else {
        this.close();
      }
    }
  }

  ngOnDestroy(): void {
    this.breakpointSub?.unsubscribe();
    this.offcanvasRef?.dismiss();
  }

  open(): void {
    if (!this.viewInitialized || !this.panelTemplate) {
      this.pendingOpen = true;
      return;
    }
    
    const useRouteMode = this.shouldUseRouteMode();
    
    if (useRouteMode) {
      this.openAsRoute();
    } else {
      this.openAsPanel();
    }
  }

  close(): void {
    this.offcanvasRef?.dismiss();
    this.offcanvasRef = undefined;
  }

  onSave(): void {
    this.saved.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.close();
    this.closed.emit();
  }

  private shouldUseRouteMode(): boolean {
    const threshold = this.mergedConfig.routeModeBreakpoint;
    
    // If no threshold specified or no mobileRoute, never use route mode
    if (!threshold || !this.mobileRoute || this.mobileRoute.length === 0) {
      return false;
    }
    
    const current = this.breakpointService.current;
    
    if (threshold === 'mobile') {
      return current === 'mobile';
    }
    if (threshold === 'tablet') {
      return current === 'mobile' || current === 'tablet';
    }
    return false;
  }

  private openAsPanel(): void {
    if (this.offcanvasRef) return;
    if (!this.panelTemplate) {
      console.warn('[ResponsiveEditorHost] panelTemplate not ready');
      return;
    }
    
    this.offcanvasRef = this.offcanvasService.open(this.panelTemplate, {
      position: this.mergedConfig.panelPosition,
      backdrop: this.mergedConfig.showBackdrop,
      keyboard: true,
      panelClass: 'responsive-editor-panel',
    });

    this.offcanvasRef.dismissed.subscribe(() => {
      this.offcanvasRef = undefined;
      this.closed.emit();
    });

    this.offcanvasRef.hidden.subscribe(() => {
      this.offcanvasRef = undefined;
      this.closed.emit();
    });
  }

  private openAsRoute(): void {
    if (this.mobileRoute && this.mobileRoute.length > 0) {
      this.router.navigate(this.mobileRoute, { relativeTo: this.route });
    }
  }
}
