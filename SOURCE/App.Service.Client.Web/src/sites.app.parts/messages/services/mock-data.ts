/**
 * Mock data for messages module
 * 
 * Provides realistic sample data for development.
 */
import { Message, MessageLabel } from '../models/message.model';

export const MOCK_LABELS: MessageLabel[] = [
  { id: 'personal', name: 'Personal', color: '#28a745', messageCount: 5 },
  { id: 'work', name: 'Work', color: '#007bff', messageCount: 12 },
  { id: 'social', name: 'Social', color: '#6f42c1', messageCount: 3 },
  { id: 'important', name: 'Important', color: '#dc3545', messageCount: 7 },
  { id: 'promotions', name: 'Promotions', color: '#ffc107', messageCount: 15 },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    senderName: 'Sarah Johnson',
    senderEmail: 'sarah.johnson@company.com',
    senderAvatar: '/assets/sites.anon/media/sensitive/images/users/avatar-2.jpg',
    recipientIds: ['current-user'],
    recipients: [{ id: 'current-user', name: 'Current User', email: 'me@company.com' }],
    subject: 'Q4 Project Update - Action Required',
    body: `Hi,

I wanted to give you a quick update on our Q4 project milestones. We're making great progress on the frontend refactoring, but we need your input on the API changes before we can proceed.

Could you please review the attached proposal and let me know your thoughts by Friday?

Key points:
- New authentication flow implementation
- Database migration timeline
- Performance optimization targets

Let me know if you have any questions.

Best regards,
Sarah`,
    preview: 'I wanted to give you a quick update on our Q4 project milestones...',
    folder: 'inbox',
    labels: ['work', 'important'],
    priority: 'high',
    isRead: false,
    isStarred: true,
    isDraft: false,
    isDeleted: false,
    hasAttachments: true,
    attachments: [
      { id: 'att-1', filename: 'Q4_Proposal.pdf', mimeType: 'application/pdf', size: 245000, url: '#' }
    ],
    createdAt: '2026-01-03T08:30:00Z',
    sentAt: '2026-01-03T08:30:00Z',
    updatedAt: '2026-01-03T08:30:00Z',
  },
  {
    id: 'msg-2',
    senderId: 'user-2',
    senderName: 'Mike Chen',
    senderEmail: 'mike.chen@company.com',
    senderAvatar: '/assets/sites.anon/media/sensitive/images/users/avatar-3.jpg',
    recipientIds: ['current-user'],
    recipients: [{ id: 'current-user', name: 'Current User', email: 'me@company.com' }],
    subject: 'Team lunch tomorrow?',
    body: `Hey!

A few of us are planning to grab lunch tomorrow at that new Thai place downtown. Want to join us?

We're thinking around 12:30. Let me know!

- Mike`,
    preview: 'A few of us are planning to grab lunch tomorrow at that new Thai place...',
    folder: 'inbox',
    labels: ['social'],
    priority: 'normal',
    isRead: true,
    isStarred: false,
    isDraft: false,
    isDeleted: false,
    hasAttachments: false,
    createdAt: '2026-01-02T16:45:00Z',
    sentAt: '2026-01-02T16:45:00Z',
    readAt: '2026-01-02T17:00:00Z',
    updatedAt: '2026-01-02T17:00:00Z',
  },
  {
    id: 'msg-3',
    senderId: 'user-3',
    senderName: 'HR Department',
    senderEmail: 'hr@company.com',
    recipientIds: ['current-user'],
    recipients: [{ id: 'current-user', name: 'Current User', email: 'me@company.com' }],
    subject: 'Annual Benefits Enrollment Now Open',
    body: `Dear Employee,

The annual benefits enrollment period is now open. Please log in to the HR portal to review and update your benefits selections.

Enrollment period: January 1 - January 31, 2026

If you have any questions, please contact the HR team.

Best,
Human Resources`,
    preview: 'The annual benefits enrollment period is now open. Please log in...',
    folder: 'inbox',
    labels: ['work'],
    priority: 'normal',
    isRead: false,
    isStarred: false,
    isDraft: false,
    isDeleted: false,
    hasAttachments: false,
    createdAt: '2026-01-02T09:00:00Z',
    sentAt: '2026-01-02T09:00:00Z',
    updatedAt: '2026-01-02T09:00:00Z',
  },
  {
    id: 'msg-4',
    senderId: 'user-4',
    senderName: 'System Notifications',
    senderEmail: 'noreply@company.com',
    recipientIds: ['current-user'],
    recipients: [{ id: 'current-user', name: 'Current User', email: 'me@company.com' }],
    subject: 'Your weekly activity summary',
    body: `Here's your weekly activity summary:

- Tasks completed: 12
- New messages: 8
- Team updates: 3
- Upcoming deadlines: 2

Keep up the great work!`,
    preview: 'Here\'s your weekly activity summary: Tasks completed: 12...',
    folder: 'inbox',
    labels: ['promotions'],
    priority: 'low',
    isRead: true,
    isStarred: false,
    isDraft: false,
    isDeleted: false,
    hasAttachments: false,
    createdAt: '2026-01-01T06:00:00Z',
    sentAt: '2026-01-01T06:00:00Z',
    readAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'msg-5',
    senderId: 'current-user',
    senderName: 'Current User',
    senderEmail: 'me@company.com',
    recipientIds: ['user-1'],
    recipients: [{ id: 'user-1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' }],
    subject: 'Re: Q4 Project Update - Action Required',
    body: `Hi Sarah,

Thanks for the update. I'll review the proposal and get back to you by Thursday.

Quick question - do we have budget approval for the database migration yet?

Thanks,
Me`,
    preview: 'Thanks for the update. I\'ll review the proposal and get back to you...',
    folder: 'sent',
    labels: ['work'],
    priority: 'normal',
    isRead: true,
    isStarred: false,
    isDraft: false,
    isDeleted: false,
    hasAttachments: false,
    threadId: 'thread-1',
    parentId: 'msg-1',
    createdAt: '2026-01-03T09:15:00Z',
    sentAt: '2026-01-03T09:15:00Z',
    updatedAt: '2026-01-03T09:15:00Z',
  },
  {
    id: 'msg-6',
    senderId: 'current-user',
    senderName: 'Current User',
    senderEmail: 'me@company.com',
    recipientIds: ['user-5'],
    recipients: [{ id: 'user-5', name: 'Client', email: 'client@external.com' }],
    subject: 'Project Proposal Draft',
    body: `Dear Client,

Please find attached the draft proposal for the upcoming project. I'd appreciate your feedback before our meeting next week.

Best regards`,
    preview: 'Please find attached the draft proposal for the upcoming project...',
    folder: 'drafts',
    labels: ['work'],
    priority: 'normal',
    isRead: true,
    isStarred: false,
    isDraft: true,
    isDeleted: false,
    hasAttachments: false,
    createdAt: '2026-01-02T14:30:00Z',
    updatedAt: '2026-01-02T15:45:00Z',
  },
  {
    id: 'msg-7',
    senderId: 'user-6',
    senderName: 'Newsletter',
    senderEmail: 'newsletter@marketing.com',
    recipientIds: ['current-user'],
    recipients: [{ id: 'current-user', name: 'Current User', email: 'me@company.com' }],
    subject: '50% OFF - Limited Time Offer!',
    body: `Don't miss out on our biggest sale of the year!

Use code SAVE50 at checkout for 50% off your next purchase.

Shop now at www.example.com`,
    preview: 'Don\'t miss out on our biggest sale of the year! Use code SAVE50...',
    folder: 'spam',
    labels: ['promotions'],
    priority: 'low',
    isRead: false,
    isStarred: false,
    isDraft: false,
    isDeleted: false,
    hasAttachments: false,
    createdAt: '2026-01-01T12:00:00Z',
    sentAt: '2026-01-01T12:00:00Z',
    updatedAt: '2026-01-01T12:00:00Z',
  },
  {
    id: 'msg-8',
    senderId: 'user-7',
    senderName: 'Old Contact',
    senderEmail: 'old@contact.com',
    recipientIds: ['current-user'],
    recipients: [{ id: 'current-user', name: 'Current User', email: 'me@company.com' }],
    subject: 'Deleted message',
    body: 'This message was deleted.',
    preview: 'This message was deleted.',
    folder: 'trash',
    isRead: true,
    isStarred: false,
    isDraft: false,
    isDeleted: true,
    hasAttachments: false,
    createdAt: '2025-12-28T10:00:00Z',
    sentAt: '2025-12-28T10:00:00Z',
    updatedAt: '2025-12-30T08:00:00Z',
  },
];
