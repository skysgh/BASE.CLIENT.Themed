/**
 * Message Service
 * 
 * API service for message operations.
 * Uses mock data for now - will connect to real API later.
 */
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { 
  Message, 
  MessageRequest, 
  MessageFilter, 
  MessageListResult,
  FolderStats,
  MessageLabel,
  MessageFolder
} from '../models/message.model';
import { MESSAGES_CONSTANTS } from '../constants';
import { MOCK_MESSAGES, MOCK_LABELS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  // State
  private messagesSubject = new BehaviorSubject<Message[]>(MOCK_MESSAGES);
  private labelsSubject = new BehaviorSubject<MessageLabel[]>(MOCK_LABELS);
  
  // Signals for reactive state
  messages = signal<Message[]>(MOCK_MESSAGES);
  selectedMessage = signal<Message | null>(null);
  currentFolder = signal<MessageFolder>('inbox');
  isLoading = signal(false);
  
  // Computed stats
  folderStats = computed<FolderStats>(() => {
    const msgs = this.messages();
    return {
      inbox: { 
        total: msgs.filter(m => m.folder === 'inbox' && !m.isDeleted).length,
        unread: msgs.filter(m => m.folder === 'inbox' && !m.isRead && !m.isDeleted).length
      },
      sent: { total: msgs.filter(m => m.folder === 'sent' && !m.isDeleted).length },
      drafts: { total: msgs.filter(m => m.folder === 'drafts' && !m.isDeleted).length },
      starred: { total: msgs.filter(m => m.isStarred && !m.isDeleted).length },
      trash: { total: msgs.filter(m => m.folder === 'trash' || m.isDeleted).length },
      spam: { total: msgs.filter(m => m.folder === 'spam').length },
    };
  });

  constructor(private http: HttpClient) {}

  // ─────────────────────────────────────────────────────────────
  // Read Operations
  // ─────────────────────────────────────────────────────────────

  /**
   * Get messages with optional filter
   */
  getMessages(filter?: MessageFilter, page = 1, pageSize = 25): Observable<MessageListResult> {
    this.isLoading.set(true);
    
    // Mock implementation - filter in memory
    let filtered = [...MOCK_MESSAGES];
    
    if (filter) {
      if (filter.folder) {
        if (filter.folder === 'starred') {
          filtered = filtered.filter(m => m.isStarred && !m.isDeleted);
        } else if (filter.folder === 'trash') {
          filtered = filtered.filter(m => m.folder === 'trash' || m.isDeleted);
        } else {
          filtered = filtered.filter(m => m.folder === filter.folder && !m.isDeleted);
        }
      }
      if (filter.isRead !== undefined) {
        filtered = filtered.filter(m => m.isRead === filter.isRead);
      }
      if (filter.isStarred !== undefined) {
        filtered = filtered.filter(m => m.isStarred === filter.isStarred);
      }
      if (filter.hasAttachments !== undefined) {
        filtered = filtered.filter(m => m.hasAttachments === filter.hasAttachments);
      }
      if (filter.query) {
        const q = filter.query.toLowerCase();
        filtered = filtered.filter(m => 
          m.subject.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q) ||
          m.senderName.toLowerCase().includes(q)
        );
      }
      if (filter.labelId) {
        filtered = filtered.filter(m => m.labels?.includes(filter.labelId!));
      }
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Paginate
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    
    const result: MessageListResult = {
      messages: paginated,
      total: filtered.length,
      page,
      pageSize,
      hasMore: start + pageSize < filtered.length
    };
    
    // Simulate network delay
    return of(result).pipe(
      delay(300),
      tap(() => {
        this.messages.set(filtered);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Get single message by ID
   */
  getMessage(id: string): Observable<Message | undefined> {
    const message = MOCK_MESSAGES.find(m => m.id === id);
    return of(message).pipe(
      delay(100),
      tap(m => {
        if (m) {
          this.selectedMessage.set(m);
        }
      })
    );
  }

  /**
   * Get folder stats
   */
  getFolderStats(): Observable<FolderStats> {
    return of(this.folderStats()).pipe(delay(100));
  }

  /**
   * Get labels
   */
  getLabels(): Observable<MessageLabel[]> {
    return of(MOCK_LABELS).pipe(delay(100));
  }

  // ─────────────────────────────────────────────────────────────
  // Write Operations
  // ─────────────────────────────────────────────────────────────

  /**
   * Send a new message
   */
  sendMessage(request: MessageRequest): Observable<Message> {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'Current User',
      senderEmail: 'user@example.com',
      recipientIds: request.recipientIds,
      recipients: request.recipientIds.map(id => ({
        id,
        name: `User ${id}`,
        email: `${id}@example.com`
      })),
      subject: request.subject,
      body: request.body,
      bodyHtml: request.bodyHtml,
      preview: request.body.substring(0, 100),
      folder: 'sent',
      labels: request.labels,
      priority: request.priority || 'normal',
      isRead: true,
      isStarred: false,
      isDraft: false,
      isDeleted: false,
      hasAttachments: false,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return of(newMessage).pipe(
      delay(500),
      tap(m => {
        const current = this.messages();
        this.messages.set([m, ...current]);
      })
    );
  }

  /**
   * Save as draft
   */
  saveDraft(request: MessageRequest): Observable<Message> {
    const draft: Message = {
      id: `draft-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'Current User',
      senderEmail: 'user@example.com',
      recipientIds: request.recipientIds,
      recipients: request.recipientIds.map(id => ({
        id,
        name: `User ${id}`,
        email: `${id}@example.com`
      })),
      subject: request.subject,
      body: request.body,
      preview: request.body.substring(0, 100),
      folder: 'drafts',
      labels: request.labels,
      isRead: true,
      isStarred: false,
      isDraft: true,
      isDeleted: false,
      hasAttachments: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return of(draft).pipe(delay(300));
  }

  // ─────────────────────────────────────────────────────────────
  // Update Operations
  // ─────────────────────────────────────────────────────────────

  /**
   * Mark message as read/unread
   */
  markAsRead(id: string, isRead: boolean): Observable<void> {
    return of(undefined).pipe(
      delay(100),
      tap(() => {
        const current = this.messages();
        const updated = current.map(m => 
          m.id === id ? { ...m, isRead, readAt: isRead ? new Date().toISOString() : undefined } : m
        );
        this.messages.set(updated);
      })
    );
  }

  /**
   * Toggle starred status
   */
  toggleStar(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(100),
      tap(() => {
        const current = this.messages();
        const updated = current.map(m => 
          m.id === id ? { ...m, isStarred: !m.isStarred } : m
        );
        this.messages.set(updated);
      })
    );
  }

  /**
   * Move message to folder
   */
  moveToFolder(id: string, folder: MessageFolder): Observable<void> {
    return of(undefined).pipe(
      delay(100),
      tap(() => {
        const current = this.messages();
        const updated = current.map(m => 
          m.id === id ? { ...m, folder, isDeleted: folder === 'trash' } : m
        );
        this.messages.set(updated);
      })
    );
  }

  /**
   * Add label to message
   */
  addLabel(id: string, labelId: string): Observable<void> {
    return of(undefined).pipe(
      delay(100),
      tap(() => {
        const current = this.messages();
        const updated = current.map(m => {
          if (m.id === id) {
            const labels = m.labels ? [...m.labels, labelId] : [labelId];
            return { ...m, labels };
          }
          return m;
        });
        this.messages.set(updated);
      })
    );
  }

  /**
   * Remove label from message
   */
  removeLabel(id: string, labelId: string): Observable<void> {
    return of(undefined).pipe(
      delay(100),
      tap(() => {
        const current = this.messages();
        const updated = current.map(m => {
          if (m.id === id && m.labels) {
            return { ...m, labels: m.labels.filter(l => l !== labelId) };
          }
          return m;
        });
        this.messages.set(updated);
      })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Delete Operations
  // ─────────────────────────────────────────────────────────────

  /**
   * Move to trash (soft delete)
   */
  moveToTrash(id: string): Observable<void> {
    return this.moveToFolder(id, 'trash');
  }

  /**
   * Permanently delete message
   */
  permanentlyDelete(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(100),
      tap(() => {
        const current = this.messages();
        this.messages.set(current.filter(m => m.id !== id));
      })
    );
  }

  /**
   * Empty trash
   */
  emptyTrash(): Observable<void> {
    return of(undefined).pipe(
      delay(300),
      tap(() => {
        const current = this.messages();
        this.messages.set(current.filter(m => m.folder !== 'trash' && !m.isDeleted));
      })
    );
  }
}
