/**
 * Spike Domain Model Overview
 * 
 * This module demonstrates a complete enterprise domain model with:
 * - Aggregate Root (Spike)
 * - Child Entities (SpikeItem)
 * - Value Objects (SpikePart)
 * - Reference Data (SpikeCategory, SpikeClassification, SpikePartType, SpikeItemType, SpikeStatus)
 * 
 * DOMAIN MODEL:
 * 
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    SPIKE (Aggregate Root)                       │
 * │  - id: string (GUID)                                           │
 * │  - title: string                                                │
 * │  - description: string                                          │
 * │  - categoryId: FK → SpikeCategory                              │
 * │  - statusId: FK → SpikeStatus                                  │
 * │  - dueDate: Date                                                │
 * │  - createdUtc: Date                                             │
 * │  - modifiedUtc: Date                                            │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  PARTS (Value Objects) [1:N]                                   │
 * │  ├── SpikePart                                                 │
 * │  │   - typeId: FK → SpikePartType                             │
 * │  │   - name: string                                            │
 * │  │   - value: string                                           │
 * │  │   - notes: string                                           │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  ITEMS (Child Entities) [1:N]                                  │
 * │  ├── SpikeItem                                                 │
 * │  │   - id: string (GUID)                                       │
 * │  │   - typeId: FK → SpikeItemType                             │
 * │  │   - description: string                                     │
 * │  │   - quantity: number                                        │
 * │  │   - unitPrice: number                                       │
 * │  │   - sequence: number                                        │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  CLASSIFICATIONS (Tags) [M:N]                                  │
 * │  └── classificationIds: FK[] → SpikeClassification            │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * REFERENCE DATA:
 * 
 * ┌──────────────────────┐  ┌──────────────────────┐
 * │   SpikeCategory      │  │   SpikeClassification│
 * │   - id, code, name   │  │   - id, code, name   │
 * │   (Feature, Bug...)  │  │   (urgent, blocked)  │
 * └──────────────────────┘  └──────────────────────┘
 * 
 * ┌──────────────────────┐  ┌──────────────────────┐
 * │   SpikePartType      │  │   SpikeItemType      │
 * │   - id, code, name   │  │   - id, code, name   │
 * │   (Owner, Reviewer)  │  │   (Task, Milestone)  │
 * └──────────────────────┘  └──────────────────────┘
 * 
 * ┌──────────────────────┐
 * │   SpikeStatus        │
 * │   - id, code, name   │
 * │   - allowedTransitions│
 * │   (Draft→Submitted→  │
 * │    Approved/Rejected)│
 * └──────────────────────┘
 * 
 * WORKFLOW (BREAST):
 * 
 * Browse → Universal Search (service.search app.let)
 *    ↓
 * Read → Detail view
 *    ↓
 * Edit → Form (Formly/JSON Forms)
 *    ↓
 * Add → Create form
 *    ↓
 * State Transition → Workflow actions
 *    - Draft → Submit
 *    - Submitted → Approve / Reject
 *    - Approved → Archive
 *    - Rejected → Revise (back to Draft)
 */

export const SPIKE_DOMAIN_VERSION = '1.0.0';
