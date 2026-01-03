/**
 * Messages Constants
 */
export const MESSAGES_CONSTANTS = {
  name: 'messages',
  version: '1.0.0',
  description: 'Internal messaging system',
  
  // Default folders
  folders: {
    inbox: { id: 'inbox', name: 'Inbox', icon: 'bx-envelope' },
    sent: { id: 'sent', name: 'Sent', icon: 'bx-send' },
    drafts: { id: 'drafts', name: 'Drafts', icon: 'bx-file' },
    starred: { id: 'starred', name: 'Starred', icon: 'bx-star' },
    trash: { id: 'trash', name: 'Trash', icon: 'bx-trash' },
    spam: { id: 'spam', name: 'Spam', icon: 'bx-shield-x' },
  },
  
  // Default labels/categories
  labels: [
    { id: 'personal', name: 'Personal', color: '#28a745' },
    { id: 'work', name: 'Work', color: '#007bff' },
    { id: 'social', name: 'Social', color: '#6f42c1' },
    { id: 'important', name: 'Important', color: '#dc3545' },
    { id: 'promotions', name: 'Promotions', color: '#ffc107' },
  ],
  
  // API endpoints (mock for now)
  api: {
    messages: '/api/messages',
    folders: '/api/messages/folders',
    labels: '/api/messages/labels',
  },
  
  // Pagination
  pageSize: 25,
  
  // Features
  features: {
    attachments: true,
    labels: true,
    search: true,
    threading: true, // Group related messages
  },
};

export type MessagesConfiguration = typeof MESSAGES_CONSTANTS;
