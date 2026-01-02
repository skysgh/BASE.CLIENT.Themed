# Hub App.Part

The central landing page for authenticated users. Displays widgets from enabled applets.

## Purpose

- **Entry Point**: First thing users see after login
- **Widget Host**: Displays summary widgets from enabled applets
- **Personalization**: Widgets can be arranged per user preference
- **Quick Navigation**: One-click access to key features

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          HUB PAGE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────┐  ┌─────────────────────┐             │
│   │    Spike Widget     │  │   Support Widget    │             │
│   │                     │  │                     │             │
│   │  [3 Active Spikes]  │  │  [2 Open Tickets]   │             │
│   │  Click to browse    │  │  Click to browse    │             │
│   └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
│   ┌─────────────────────┐  ┌─────────────────────┐             │
│   │   Recent Activity   │  │     Quick Actions   │             │
│   │                     │  │                     │             │
│   └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Widget System

Each applet can register widgets:

```typescript
interface HubWidget {
  id: string;
  appletId: string;
  title: string;
  icon: string;
  component: Type<any>;
  order: number;
  size: 'small' | 'medium' | 'large';
  minPermission?: string;
}
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/system/hub` | HubComponent | Main hub page |

## Widgets

Widgets are standalone components that:
- Fetch their own data
- Show loading/error states
- Navigate to their applet on click
- Are responsive

Example widgets:
- Spike count widget → navigates to Spike Browse
- Support tickets widget → navigates to Support Browse
- Recent activity widget → shows recent actions
- Quick actions widget → common actions

## Configuration

Account-level config:
```json
{
  "hub": {
    "widgets": ["spike", "support", "activity"],
    "layout": "grid"
  }
}
```
