/**
 * Classic Mailbox Component
 * 
 * Traditional email client layout with:
 * - Sidebar navigation (folders, labels)
 * - Message list with preview
 * - Reading pane
 */
import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from '../../../../services/message.service';
import { Message, MessageFolder, MessageLabel, FolderStats } from '../../../../models/message.model';
import { MESSAGES_CONSTANTS } from '../../../../constants';

@Component({
  selector: 'app-classic-mailbox',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="email-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
      <!-- Sidebar -->
      <div class="email-menu-sidebar">
        <div class="p-4 d-flex flex-column h-100">
          <!-- Compose Button -->
          <div class="pb-4 border-bottom border-bottom-dashed">
            <button type="button" 
                    class="btn btn-primary w-100"
                    (click)="openCompose()">
              <i class="ri-add-line align-bottom me-1"></i> Compose
            </button>
          </div>

          <!-- Folders -->
          <div class="mt-4">
            <ul class="mail-list link-list-group">
              @for (folder of folders; track folder.id) {
                <li (click)="selectFolder(folder.id)" 
                    [class.active]="currentFolder() === folder.id">
                  <a href="javascript:void(0);" class="d-flex align-items-center">
                    <i class="bx {{ folder.icon }} me-2 fs-16"></i>
                    <span class="flex-grow-1">{{ folder.name }}</span>
                    @if (folder.id === 'inbox' && stats().inbox.unread > 0) {
                      <span class="badge bg-danger">{{ stats().inbox.unread }}</span>
                    }
                    @if (folder.id === 'drafts' && stats().drafts.total > 0) {
                      <span class="badge bg-secondary">{{ stats().drafts.total }}</span>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Labels -->
          <div class="mt-4">
            <h6 class="text-uppercase fs-11 fw-semibold text-muted">Labels</h6>
            <ul class="mail-list link-list-group">
              @for (label of labels(); track label.id) {
                <li (click)="selectLabel(label.id)"
                    [class.active]="currentLabel() === label.id">
                  <a href="javascript:void(0);" class="d-flex align-items-center">
                    <span class="ri-checkbox-blank-circle-fill me-2" 
                          [style.color]="label.color"></span>
                    <span class="flex-grow-1">{{ label.name }}</span>
                    @if (label.messageCount) {
                      <span class="text-muted">{{ label.messageCount }}</span>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Storage (mock) -->
          <div class="mt-auto pt-4 border-top border-top-dashed">
            <h6 class="text-uppercase fs-11 fw-semibold text-muted mb-3">Storage</h6>
            <div class="progress progress-sm mb-2">
              <div class="progress-bar bg-primary" style="width: 35%"></div>
            </div>
            <span class="text-muted fs-12">3.5 GB of 10 GB used</span>
          </div>
        </div>
      </div>

      <!-- Message List -->
      <div class="email-content">
        <div class="p-4 pb-0">
          <!-- Toolbar -->
          <div class="border-bottom border-bottom-dashed mb-4 pb-3">
            <div class="row align-items-center">
              <div class="col">
                <div class="d-flex align-items-center gap-2">
                  <!-- Select All -->
                  <div class="form-check fs-14">
                    <input class="form-check-input" type="checkbox" 
                           [checked]="allSelected()"
                           (change)="toggleSelectAll()">
                  </div>
                  
                  <!-- Actions -->
                  @if (selectedMessages().length > 0) {
                    <button class="btn btn-sm btn-soft-secondary" 
                            (click)="archiveSelected()" title="Archive">
                      <i class="ri-inbox-archive-line"></i>
                    </button>
                    <button class="btn btn-sm btn-soft-danger" 
                            (click)="deleteSelected()" title="Delete">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                    <button class="btn btn-sm btn-soft-secondary" 
                            (click)="markSelectedRead()" title="Mark as read">
                      <i class="ri-mail-open-line"></i>
                    </button>
                  }

                  <!-- Refresh -->
                  <button class="btn btn-sm btn-soft-secondary" 
                          (click)="refresh()" title="Refresh">
                    <i class="ri-refresh-line"></i>
                  </button>
                </div>
              </div>
              <div class="col-auto">
                <!-- Search -->
                <div class="search-box">
                  <input type="text" class="form-control form-control-sm bg-light border-0" 
                         placeholder="Search messages..."
                         [(ngModel)]="searchQuery"
                         (ngModelChange)="onSearch()">
                  <i class="ri-search-line search-icon"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Message List -->
          <div class="message-list-content" style="max-height: calc(100vh - 300px); overflow-y: auto;">
            @if (isLoading()) {
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            } @else if (messages().length === 0) {
              <div class="text-center py-5 text-muted">
                <i class="bx bx-envelope display-1"></i>
                <h5 class="mt-3">No messages</h5>
                <p>This folder is empty</p>
              </div>
            } @else {
              <ul class="message-list">
                @for (msg of messages(); track msg.id) {
                  <li [class.unread]="!msg.isRead"
                      [class.active]="selectedMessage()?.id === msg.id"
                      (click)="selectMessage(msg)">
                    <div class="col-mail col-mail-1">
                      <div class="form-check checkbox-wrapper-mail">
                        <input type="checkbox" class="form-check-input"
                               [checked]="isSelected(msg.id)"
                               (click)="toggleSelect(msg.id, $event)">
                      </div>
                      <button class="btn btn-link p-0 star-toggle"
                              [class.active]="msg.isStarred"
                              (click)="toggleStar(msg, $event)">
                        <i class="bx" [class.bxs-star]="msg.isStarred" [class.bx-star]="!msg.isStarred"></i>
                      </button>
                      <div class="title">
                        @if (msg.senderAvatar) {
                          <img [src]="msg.senderAvatar" class="avatar-xs rounded-circle me-2" alt="">
                        }
                        <span>{{ msg.senderName }}</span>
                      </div>
                    </div>
                    <div class="col-mail col-mail-2">
                      <div class="subject">
                        @if (msg.hasAttachments) {
                          <i class="bx bx-paperclip me-1"></i>
                        }
                        <span class="subject-title">{{ msg.subject }}</span>
                        <span class="teaser"> - {{ msg.preview }}</span>
                      </div>
                      <div class="date">
                        {{ formatDate(msg.createdAt) }}
                      </div>
                    </div>
                  </li>
                }
              </ul>
            }
          </div>
        </div>
      </div>

      <!-- Reading Pane -->
      @if (selectedMessage()) {
        <div class="email-detail-content">
          <div class="p-4 d-flex flex-column h-100">
            <!-- Close button (mobile) -->
            <div class="d-lg-none mb-3">
              <button class="btn btn-soft-secondary btn-sm" (click)="closeDetail()">
                <i class="ri-arrow-left-line"></i> Back
              </button>
            </div>

            <!-- Message Header -->
            <div class="border-bottom border-bottom-dashed pb-4 mb-4">
              <div class="d-flex align-items-center mb-3">
                <div class="flex-shrink-0 avatar-sm">
                  @if (selectedMessage()!.senderAvatar) {
                    <img [src]="selectedMessage()!.senderAvatar" class="rounded-circle" alt="">
                  } @else {
                    <span class="avatar-title bg-primary-subtle text-primary rounded-circle fs-5">
                      {{ selectedMessage()!.senderName.charAt(0) }}
                    </span>
                  }
                </div>
                <div class="flex-grow-1 ms-3">
                  <h5 class="fs-14 mb-0">{{ selectedMessage()!.senderName }}</h5>
                  <span class="text-muted fs-12">{{ selectedMessage()!.senderEmail }}</span>
                </div>
                <div class="flex-shrink-0">
                  <span class="text-muted fs-12">{{ formatDateTime(selectedMessage()!.createdAt) }}</span>
                </div>
              </div>
              <h4 class="mb-0">{{ selectedMessage()!.subject }}</h4>
            </div>

            <!-- Message Body -->
            <div class="flex-grow-1" style="overflow-y: auto;">
              <div class="email-body" [innerHTML]="selectedMessage()!.bodyHtml || formatBody(selectedMessage()!.body)">
              </div>

              <!-- Attachments -->
              @if (selectedMessage()!.hasAttachments && selectedMessage()!.attachments) {
                <div class="mt-4 pt-4 border-top">
                  <h6 class="mb-3">
                    <i class="bx bx-paperclip me-1"></i>
                    Attachments ({{ selectedMessage()!.attachments!.length }})
                  </h6>
                  <div class="d-flex flex-wrap gap-2">
                    @for (att of selectedMessage()!.attachments; track att.id) {
                      <div class="border rounded p-2 d-flex align-items-center">
                        <i class="bx bx-file me-2 fs-5"></i>
                        <div>
                          <span class="d-block fs-13">{{ att.filename }}</span>
                          <span class="text-muted fs-12">{{ formatSize(att.size) }}</span>
                        </div>
                        <button class="btn btn-link btn-sm ms-2">
                          <i class="bx bx-download"></i>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Actions -->
            <div class="mt-auto pt-4 border-top">
              <div class="d-flex gap-2">
                <button class="btn btn-primary" (click)="reply()">
                  <i class="ri-reply-line me-1"></i> Reply
                </button>
                <button class="btn btn-soft-secondary" (click)="forward()">
                  <i class="ri-share-forward-line me-1"></i> Forward
                </button>
                <button class="btn btn-soft-danger ms-auto" (click)="deleteMessage(selectedMessage()!)">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .email-wrapper {
      height: calc(100vh - 180px);
    }

    .email-menu-sidebar {
      width: 250px;
      flex-shrink: 0;
      background: var(--vz-card-bg);
      border-radius: var(--vz-border-radius);
    }

    .email-content {
      flex-grow: 1;
      background: var(--vz-card-bg);
      border-radius: var(--vz-border-radius);
      min-width: 0;
    }

    .email-detail-content {
      width: 450px;
      flex-shrink: 0;
      background: var(--vz-card-bg);
      border-radius: var(--vz-border-radius);
    }

    .mail-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .mail-list li {
      padding: 8px 12px;
      border-radius: var(--vz-border-radius);
      cursor: pointer;
      transition: all 0.2s;
    }

    .mail-list li:hover {
      background: var(--vz-light);
    }

    .mail-list li.active {
      background: var(--vz-primary-bg-subtle);
    }

    .mail-list li.active a {
      color: var(--vz-primary);
    }

    .mail-list a {
      color: var(--vz-body-color);
      text-decoration: none;
    }

    .message-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .message-list li {
      display: flex;
      padding: 12px;
      border-bottom: 1px solid var(--vz-border-color);
      cursor: pointer;
      transition: background 0.2s;
    }

    .message-list li:hover {
      background: var(--vz-light);
    }

    .message-list li.active {
      background: var(--vz-primary-bg-subtle);
    }

    .message-list li.unread {
      background: rgba(var(--vz-primary-rgb), 0.05);
    }

    .message-list li.unread .title,
    .message-list li.unread .subject-title {
      font-weight: 600;
    }

    .col-mail-1 {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 200px;
      flex-shrink: 0;
    }

    .col-mail-2 {
      flex-grow: 1;
      display: flex;
      align-items: center;
      min-width: 0;
    }

    .col-mail-2 .subject {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .col-mail-2 .teaser {
      color: var(--vz-secondary-color);
    }

    .col-mail-2 .date {
      flex-shrink: 0;
      margin-left: 12px;
      color: var(--vz-secondary-color);
      font-size: 12px;
    }

    .star-toggle {
      color: var(--vz-secondary-color);
    }

    .star-toggle.active {
      color: #ffc107;
    }

    .email-body {
      white-space: pre-wrap;
      line-height: 1.6;
    }

    @media (max-width: 1199px) {
      .email-menu-sidebar {
        display: none;
      }
    }

    @media (max-width: 991px) {
      .email-detail-content {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        z-index: 1050;
      }
    }
  `]
})
export class ClassicMailboxComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();

  // Folder config
  folders = Object.values(MESSAGES_CONSTANTS.folders);

  // State
  messages = this.messageService.messages;
  isLoading = this.messageService.isLoading;
  stats = this.messageService.folderStats;
  labels = signal<MessageLabel[]>([]);
  
  currentFolder = signal<MessageFolder>('inbox');
  currentLabel = signal<string | null>(null);
  selectedMessage = signal<Message | null>(null);
  selectedIds = signal<Set<string>>(new Set());
  searchQuery = '';

  // Computed
  selectedMessages = computed(() => {
    const ids = this.selectedIds();
    return this.messages().filter(m => ids.has(m.id));
  });

  allSelected = computed(() => {
    const msgs = this.messages();
    const selected = this.selectedIds();
    return msgs.length > 0 && msgs.every(m => selected.has(m.id));
  });

  ngOnInit(): void {
    // Load labels
    this.messageService.getLabels().subscribe(labels => {
      this.labels.set(labels);
    });

    // Watch route params for folder
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const folder = params.get('folder') as MessageFolder || 'inbox';
      this.currentFolder.set(folder);
      this.currentLabel.set(null);
      this.loadMessages();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────

  selectFolder(folderId: string): void {
    this.router.navigate(['..', folderId], { relativeTo: this.route });
  }

  selectLabel(labelId: string): void {
    this.currentLabel.set(labelId);
    this.currentFolder.set('inbox'); // Reset folder
    this.loadMessages();
  }

  openCompose(): void {
    // TODO: Open compose modal or navigate to compose route
    console.log('Open compose');
  }

  // ─────────────────────────────────────────────────────────────
  // Message Operations
  // ─────────────────────────────────────────────────────────────

  loadMessages(): void {
    const filter = {
      folder: this.currentFolder(),
      labelId: this.currentLabel() || undefined,
      query: this.searchQuery || undefined
    };
    this.messageService.getMessages(filter).subscribe();
  }

  refresh(): void {
    this.loadMessages();
  }

  onSearch(): void {
    this.loadMessages();
  }

  selectMessage(msg: Message): void {
    this.selectedMessage.set(msg);
    if (!msg.isRead) {
      this.messageService.markAsRead(msg.id, true).subscribe();
    }
  }

  closeDetail(): void {
    this.selectedMessage.set(null);
  }

  // ─────────────────────────────────────────────────────────────
  // Selection
  // ─────────────────────────────────────────────────────────────

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelect(id: string, event: Event): void {
    event.stopPropagation();
    const current = this.selectedIds();
    const newSet = new Set(current);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.selectedIds.set(newSet);
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      const allIds = new Set(this.messages().map(m => m.id));
      this.selectedIds.set(allIds);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  toggleStar(msg: Message, event: Event): void {
    event.stopPropagation();
    this.messageService.toggleStar(msg.id).subscribe();
  }

  archiveSelected(): void {
    this.selectedMessages().forEach(msg => {
      this.messageService.moveToFolder(msg.id, 'archive').subscribe();
    });
    this.selectedIds.set(new Set());
  }

  deleteSelected(): void {
    this.selectedMessages().forEach(msg => {
      this.messageService.moveToTrash(msg.id).subscribe();
    });
    this.selectedIds.set(new Set());
  }

  markSelectedRead(): void {
    this.selectedMessages().forEach(msg => {
      this.messageService.markAsRead(msg.id, true).subscribe();
    });
  }

  deleteMessage(msg: Message): void {
    this.messageService.moveToTrash(msg.id).subscribe(() => {
      this.selectedMessage.set(null);
    });
  }

  reply(): void {
    // TODO: Open compose with reply
    console.log('Reply to:', this.selectedMessage()?.id);
  }

  forward(): void {
    // TODO: Open compose with forward
    console.log('Forward:', this.selectedMessage()?.id);
  }

  // ─────────────────────────────────────────────────────────────
  // Formatting
  // ─────────────────────────────────────────────────────────────

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatBody(body: string): string {
    // Simple formatting - replace newlines with <br>
    return body.replace(/\n/g, '<br>');
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
