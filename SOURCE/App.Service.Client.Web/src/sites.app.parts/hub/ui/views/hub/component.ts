/**
 * Hub Component
 * 
 * Main hub page displaying widgets from enabled applets.
 * Widgets are dynamically rendered based on account config.
 */
import { Component, inject, OnInit, signal, computed, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasRef, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { HubService } from '../../../services';
import { HubWidgetConfig } from '../../../models';
import { SpikeWidgetComponent, ActivityWidgetComponent, AstronomyWidgetComponent } from '../../widgets';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, NgComponentOutlet, NgbOffcanvasModule, DragDropModule, SpikeWidgetComponent, ActivityWidgetComponent, AstronomyWidgetComponent],
  template: `
    <div class="hub-page">
      <!-- Header -->
      <div class="hub-header mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <!-- Title -->
          <div>
            <h4 class="mb-1">
              <i class="bx bx-home-alt me-2 text-primary"></i>
              Hub
            </h4>
            <p class="text-muted mb-0">
              Welcome back! Here's an overview of your workspace.
            </p>
          </div>
          
          <!-- Config Button -->
          <div class="d-flex gap-2 align-items-center">
            <button class="btn btn-outline-secondary" 
                    (click)="openConfigPanel()"
                    title="Configure hub widgets">
              <i class="bx bx-cog"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Widget Grid - Dynamic from registered widgets -->
      <div class="row g-4">
        @for (widget of widgets(); track widget.id) {
          <div [class]="getWidgetColumnClass(widget)">
            @if (widget.component) {
              <ng-container *ngComponentOutlet="widget.component"></ng-container>
            } @else {
              <!-- Fallback placeholder if no component -->
              <div class="widget-card card h-100">
                <div class="card-body text-center py-5">
                  <div class="widget-icon mx-auto mb-3" [class]="'bg-' + (widget.appletId === 'spike' ? 'primary' : 'secondary') + '-subtle'">
                    <i [class]="widget.icon"></i>
                  </div>
                  <h6>{{ widget.title }}</h6>
                  <p class="text-muted small mb-0">Widget loading...</p>
                </div>
              </div>
            }
          </div>
        }
        
        <!-- Empty state if no widgets -->
              @if (widgets().length === 0) {
                <div class="col-12">
                  <div class="alert alert-info text-center">
                    <i class="bx bx-info-circle me-2"></i>
                    No widgets configured. Enable applets in account settings to see widgets here.
                  </div>
                </div>
              }
            </div>
          </div>
    
          <!-- Config Panel (Offcanvas - Right Pullout) -->
          <ng-template #configPanel let-offcanvas>
            <div class="offcanvas-header border-bottom">
              <h5 class="offcanvas-title">
                <i class="bx bx-slider me-2"></i>
                        Configure Hub Widgets
                      </h5>
                      <button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss()"></button>
                    </div>
                    <div class="offcanvas-body">
                      <p class="text-muted small mb-3">
                        Drag to reorder. Toggle visibility for each widget.
                      </p>
                      <div class="widget-config-list" cdkDropList (cdkDropListDropped)="onWidgetDrop($event)">
                        @for (item of configWidgets(); track item.widget.id) {
                          <div class="widget-config-item d-flex align-items-center gap-3 p-2 border rounded mb-2" 
                               cdkDrag 
                               [cdkDragDisabled]="item.locked">
                            <i class="bx bx-grid-vertical drag-handle" 
                               [class.text-muted]="!item.locked"
                               [class.text-secondary]="item.locked"
                               cdkDragHandle></i>
                            <div class="widget-icon-sm" [class]="'bg-' + getWidgetColor(item.widget) + '-subtle'">
                              <i [class]="item.widget.icon"></i>
                            </div>
                            <div class="flex-grow-1">
                              <span class="fw-medium">{{ item.widget.title }}</span>
                              @if (item.locked) {
                                <i class="bx bx-lock-alt text-warning ms-1" title="Locked by administrator"></i>
                              }
                            </div>
                            <div class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" 
                                     [checked]="item.visible"
                                     [disabled]="item.locked"
                                     (change)="toggleWidget(item.widget.id)">
                            </div>
                          </div>
                        }
                      </div>
                      <div class="mt-3">
                        <small class="text-muted">
                          <i class="bx bx-info-circle me-1"></i>
                          For advanced options, go to <a routerLink="/settings/hub" (click)="offcanvas.close()">Hub Settings</a>
                        </small>
                      </div>
                    </div>
                  </ng-template>
                `,
    styles: [`
      .hub-page {
        padding: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }
    
      .widget-card {
        border: 1px solid var(--vz-border-color);
      }
    
      .widget-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
    
      .hub-config-panel {
        border: 1px solid var(--vz-primary);
        background: var(--vz-card-bg);
      }
    
      .widget-icon-sm {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }
    
      .widget-config-item {
          background: var(--vz-card-bg);
          transition: all 0.2s;
        }
    
        .widget-config-item:hover {
          background: var(--vz-light);
        }
    
        .widget-config-item.cdk-drag-preview {
          box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
          border-radius: 4px;
        }
      
        .widget-config-item.cdk-drag-placeholder {
          opacity: 0.3;
        }
      
        .widget-config-item.cdk-drag-animating {
          transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
      
        .widget-config-list.cdk-drop-list-dragging .widget-config-item:not(.cdk-drag-placeholder) {
          transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
    
        .drag-handle {
          cursor: grab;
        }
      
        .drag-handle:active {
          cursor: grabbing;
        }
    
        .btn.active {
          background-color: var(--vz-primary);
          color: white;
        }
      `]
      })
      export class HubComponent implements OnInit {
        private hubService = inject(HubService);
        private offcanvasService = inject(NgbOffcanvas);

        @ViewChild('configPanel') configPanelTemplate!: TemplateRef<any>;

        // Get widgets from service (filtered by account config)
        widgets = computed(() => this.hubService.appletWidgets());
  
        // Config panel widgets with visibility and lock info
        configWidgets = signal<{ widget: HubWidgetConfig; visible: boolean; locked: boolean }[]>([]);

        ngOnInit(): void {
          // Register built-in widgets if not already registered
          this.registerBuiltInWidgets();
        }
  
        /**
         * Open config panel as offcanvas (right pullout)
         */
        openConfigPanel(): void {
          // Get widgets with visibility info for config panel
          this.configWidgets.set(this.hubService.getAllWidgets());
        
          this.offcanvasService.open(this.configPanelTemplate, {
            position: 'end',
            panelClass: 'hub-config-offcanvas'
          });
        }
      
        /**
         * Handle drag-drop reorder
         */
        onWidgetDrop(event: CdkDragDrop<{ widget: HubWidgetConfig; visible: boolean; locked: boolean }[]>): void {
          const items = [...this.configWidgets()];
          moveItemInArray(items, event.previousIndex, event.currentIndex);
          this.configWidgets.set(items);
        
          // Update order in service
          this.hubService.reorderWidgets(items.map(i => i.widget.id));
        }
  
        /**
         * Toggle widget visibility
         */
        toggleWidget(widgetId: string): void {
          this.hubService.toggleWidgetVisibility(widgetId);
          // Update local copy
          this.configWidgets.set(this.hubService.getAllWidgets());
        }
  
        /**
         * Get widget color based on applet
         */
        getWidgetColor(widget: HubWidgetConfig): string {
          const colors: Record<string, string> = {
            'spike': 'primary',
            'astronomy': 'warning',
            'activity': 'info',
          };
          return colors[widget.appletId] || 'secondary';
        }
  
      /**
       * Register the built-in widgets
       */
      private registerBuiltInWidgets(): void {
    // Spike widget
    this.hubService.registerWidget({
      id: 'spike-summary',
      appletId: 'spike',
      title: 'Spikes',
      icon: 'bx bx-bulb',
      size: 'medium',
      order: 1,
      enabled: true,
      clickRoute: '/apps/spike',
      component: SpikeWidgetComponent,
    });
    
    // Astronomy widget
    this.hubService.registerWidget({
      id: 'astronomy-summary',
      appletId: 'astronomy',
      title: 'Astronomy',
      icon: 'bx bx-planet',
      size: 'medium',
      order: 2,
      enabled: true,
      clickRoute: '/apps/astronomy',
      component: AstronomyWidgetComponent,
    });
    
      // Activity widget - now its own applet
      this.hubService.registerWidget({
        id: 'activity-feed',
        appletId: 'activity',
        title: 'Recent Activity',
        icon: 'bx bx-time',
        size: 'medium',
        order: 10,
        enabled: true,
        component: ActivityWidgetComponent,
      });
    }
  
    /**
     * Get Bootstrap column class based on widget size
     */
  getWidgetColumnClass(widget: HubWidgetConfig): string {
    switch (widget.size) {
      case 'small':
        return 'col-12 col-md-4 col-lg-3';
      case 'large':
        return 'col-12 col-lg-8';
      case 'full':
        return 'col-12';
      case 'medium':
      default:
        return 'col-12 col-md-6 col-lg-4';
    }
  }
}
