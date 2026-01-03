/**
 * Message Models
 * 
 * Core data models for the messaging system.
 */

/**
 * Message - Core message entity
 */
export interface Message {
  id: string;
  
  // Participants
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  
  recipientIds: string[];
  recipients: MessageRecipient[];
  
  ccIds?: string[];
  cc?: MessageRecipient[];
  
  bccIds?: string[];
  
  // Content
  subject: string;
  body: string;
  bodyHtml?: string;
  preview?: string; // First ~100 chars for list view
  
  // Metadata
  folder: MessageFolder;
  labels?: string[];
  priority?: 'low' | 'normal' | 'high';
  
  // State
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  isDeleted: boolean;
  
  // Threading
  threadId?: string;
  parentId?: string; // For replies
  replyCount?: number;
  
  // Attachments
  hasAttachments: boolean;
  attachments?: MessageAttachment[];
  
  // Timestamps
  createdAt: string;
  sentAt?: string;
  readAt?: string;
  updatedAt: string;
}

/**
 * Message recipient info
 */
export interface MessageRecipient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

/**
 * Message folder types
 */
export type MessageFolder = 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash' | 'spam' | 'archive';

/**
 * Message label
 */
export interface MessageLabel {
  id: string;
  name: string;
  color: string;
  messageCount?: number;
}

/**
 * Folder stats for sidebar
 */
export interface FolderStats {
  inbox: { total: number; unread: number };
  sent: { total: number };
  drafts: { total: number };
  starred: { total: number };
  trash: { total: number };
  spam: { total: number };
}

/**
 * Message compose/edit request
 */
export interface MessageRequest {
  recipientIds: string[];
  ccIds?: string[];
  bccIds?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  labels?: string[];
  priority?: 'low' | 'normal' | 'high';
  attachmentIds?: string[];
  isDraft?: boolean;
  replyToId?: string; // For replies
}

/**
 * Message search/filter criteria
 */
export interface MessageFilter {
  folder?: MessageFolder;
  labelId?: string;
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  senderId?: string;
  query?: string; // Full-text search
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Message list result
 */
export interface MessageListResult {
  messages: Message[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Thread - Group of related messages
 */
export interface MessageThread {
  id: string;
  subject: string;
  participants: MessageRecipient[];
  messages: Message[];
  messageCount: number;
  lastMessage: Message;
  unreadCount: number;
  isStarred: boolean;
  labels: string[];
}
