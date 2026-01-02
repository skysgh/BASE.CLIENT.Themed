# Workflows App.Part

Workflow engine for conditional branching, steps, and state management.

## Purpose

Provides a foundation for:
- **Surveys**: Conditional question branching
- **Wizards**: Multi-step forms with branching
- **Approval flows**: Sequential approval chains
- **Onboarding**: Guided user journeys

## Core Concepts

### Workflow
A workflow is a directed graph of steps with:
- **Steps**: Individual units of work (questions, actions, decisions)
- **Transitions**: Connections between steps with conditions
- **State**: Current position and collected data

### Step Types
| Type | Description |
|------|-------------|
| `form` | Collect user input |
| `decision` | Branch based on condition |
| `action` | Execute an action (API call, etc.) |
| `end` | Terminal step |

### Transition Conditions
```typescript
{
  from: 'step-1',
  to: 'step-2',
  condition: {
    field: 'answer',
    operator: 'equals',
    value: 'yes'
  }
}
```

## Structure

```
workflows/
├── models/
│   ├── workflow.model.ts      # Workflow definition
│   ├── step.model.ts          # Step types
│   ├── transition.model.ts    # Transition with conditions
│   └── state.model.ts         # Runtime state
├── services/
│   ├── workflow.service.ts    # Workflow execution engine
│   └── condition.service.ts   # Condition evaluation
├── ui/
│   ├── views/                 # Admin views (workflow designer)
│   └── widgets/               # Step renderers
├── module.ts
└── index.ts
```

## Usage by Surveys

The surveys app.let uses workflows like this:
```typescript
// Survey as a workflow
const surveyWorkflow: Workflow = {
  id: 'customer-satisfaction',
  steps: [
    { id: 'q1', type: 'form', data: { question: 'How satisfied are you?' } },
    { id: 'q2-good', type: 'form', data: { question: 'What did you like?' } },
    { id: 'q2-bad', type: 'form', data: { question: 'How can we improve?' } },
    { id: 'end', type: 'end' }
  ],
  transitions: [
    { from: 'q1', to: 'q2-good', condition: { field: 'satisfaction', operator: 'gte', value: 4 } },
    { from: 'q1', to: 'q2-bad', condition: { field: 'satisfaction', operator: 'lt', value: 4 } },
    { from: 'q2-good', to: 'end' },
    { from: 'q2-bad', to: 'end' }
  ]
};
```

## Future Enhancements

- Visual workflow designer
- Workflow templates
- Analytics on paths taken
- A/B testing support
