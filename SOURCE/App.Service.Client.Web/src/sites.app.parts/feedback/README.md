# Feedback App.Part (Planned)

Positive feedback and testimonials - separate from Support (issues/ideas).

## Purpose

- Collect positive feedback (praise)
- Curate testimonials for marketing
- Display on landing pages

## Current Status

**Temporarily integrated into Support app.part as "Share Praise"**.

Will be extracted to its own app.part when:
1. UniversalSearch + Spike patterns are finalized
2. Need for separate testimonial management arises

## Planned Architecture

```
sites.app.parts/feedback/
├── README.md
├── constants/
│   ├── feedback.constants.ts
│   └── index.ts
├── models/
│   ├── feedback-item.dto.ts
│   ├── feedback-item.view-model.ts
│   ├── testimonial.dto.ts        ← Curated for public
│   ├── testimonial.view-model.ts
│   └── index.ts
├── mappers/
│   ├── feedback-item.mapper.ts
│   ├── testimonial.mapper.ts
│   └── index.ts
├── repositories/
│   ├── feedback-item.repository.ts
│   ├── testimonial.repository.ts
│   └── index.ts
├── services/
│   ├── feedback.service.ts
│   ├── testimonial.service.ts    ← For approved testimonials
│   └── index.ts
├── views/
│   ├── feedback-hub/             ← Admin: manage all feedback
│   ├── item-add/                 ← Submit praise
│   ├── item-read/                ← View feedback detail
│   └── testimonials-browse/      ← Public-facing view
├── widgets/
│   └── testimonial-carousel/     ← For landing pages
├── module.ts
├── routing.ts
└── index.ts
```

## Key Entities

### FeedbackItem (Internal)
```typescript
interface FeedbackItemDTO {
  id: string;
  submittedBy: string;
  title: string;
  description: string;
  allowTestimonial: boolean;    // User consented
  isApprovedForPublic: boolean; // Admin approved
  category?: string;
  createdAt: string;
}
```

### Testimonial (Public-facing)
```typescript
interface TestimonialDTO {
  id: string;
  feedbackItemId: string;       // Source feedback
  quote: string;                // May be edited excerpt
  authorName: string;           // May be "Anonymous"
  authorTitle?: string;
  authorCompany?: string;
  authorAvatar?: string;
  rating?: number;
  isFeatured: boolean;
  displayOrder: number;
}
```

## Integration Points

### From Support Hub
Support Hub links to "Share Praise" which uses the feedback form.

### On Landing Page
```typescript
// sites.anon/features/pages/landing/testimonials/
import { TestimonialService } from 'sites.app.parts/feedback';

// Displays approved testimonials
```

### Workflow

```
User submits praise
  ↓
FeedbackItem created (allowTestimonial: true/false)
  ↓
Admin reviews (if allowTestimonial)
  ↓
Creates Testimonial (public)
  ↓
Appears on landing page
```

## Migration Plan

When ready to extract:

1. Create `sites.app.parts/feedback/` structure
2. Move praise-related code from Support
3. Update Support Hub to link to Feedback
4. Update landing page to import from Feedback
5. Add admin testimonial management
