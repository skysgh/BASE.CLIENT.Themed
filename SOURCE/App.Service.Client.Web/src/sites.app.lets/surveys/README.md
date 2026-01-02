# Surveys App.Let

Configurable surveys with conditional branching (wizard-style).

**Location**: `sites.app.lets/surveys/` (moved from app.parts - it's a full domain with CRUD)

## Purpose

- **Collect Feedback**: NPS, satisfaction, feature requests
- **Onboarding**: User profile completion, preferences
- **Research**: Market research, user studies
- **Compliance**: Required acknowledgments, training verification

## Key Features

### Conditional Branching
```
Q1: How satisfied are you? [1-5]
  └── If 1-2 → Show "What went wrong?" section
  └── If 3   → Show "What could be better?" section
  └── If 4-5 → Show "What did you like?" section
```

### Question Types
- **Single Choice**: Radio buttons
- **Multiple Choice**: Checkboxes
- **Scale**: 1-5, 1-10, NPS (0-10)
- **Text**: Short answer, long answer
- **Rating**: Stars, emoji
- **Matrix**: Grid of questions with same options
- **Ranking**: Drag to order items

### Display Logic
```typescript
interface DisplayCondition {
  questionId: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: string | number | string[];
}

interface QuestionGroup {
  id: string;
  title: string;
  displayConditions: DisplayCondition[];  // Show if ALL conditions met
  displayLogic: 'and' | 'or';             // How to combine conditions
  questions: SurveyQuestion[];
}
```

## Architecture

```
sites.app.parts/surveys/
├── README.md
├── constants/
│   ├── survey.constants.ts
│   └── index.ts
├── models/
│   ├── survey.dto.ts
│   ├── survey.view-model.ts
│   ├── survey-question.dto.ts
│   ├── survey-question.view-model.ts
│   ├── survey-response.dto.ts
│   ├── survey-response.view-model.ts
│   ├── display-condition.model.ts
│   └── index.ts
├── mappers/
│   ├── survey.mapper.ts
│   ├── survey-question.mapper.ts
│   ├── survey-response.mapper.ts
│   └── index.ts
├── repositories/
│   ├── survey.repository.ts
│   └── index.ts
├── services/
│   ├── survey.service.ts
│   ├── survey-response.service.ts
│   ├── survey-logic.service.ts       ← Evaluates display conditions
│   └── index.ts
├── ui/
│   ├── views/
│   │   ├── survey-hub/               ← List available surveys
│   │   ├── survey-take/              ← Take a survey
│   │   ├── survey-results/           ← View results (admin)
│   │   └── admin/
│   │       ├── survey-browse/        ← Manage surveys
│   │       ├── survey-edit/          ← Edit survey
│   │       └── survey-builder/       ← Drag-drop question builder
│   └── widgets/
│       └── pending-surveys/          ← Hub widget
├── module.ts
├── routing.ts
└── index.ts
```

## Models

### Survey
```typescript
interface SurveyDTO {
  id: string;
  title: string;
  description?: string;
  type: 'feedback' | 'onboarding' | 'research' | 'compliance';
  status: 'draft' | 'active' | 'closed' | 'archived';
  startDate?: string;
  endDate?: string;
  allowAnonymous: boolean;
  requiresCompletion: boolean;  // Must complete before continuing
  maxResponses?: number;
  groups: QuestionGroupDTO[];
  metadata?: Record<string, unknown>;
}
```

### Question Group (for conditional display)
```typescript
interface QuestionGroupDTO {
  id: string;
  title?: string;
  description?: string;
  order: number;
  displayConditions: DisplayConditionDTO[];  // When to show this group
  displayLogic: 'and' | 'or';
  questions: SurveyQuestionDTO[];
}
```

### Survey Question
```typescript
interface SurveyQuestionDTO {
  id: string;
  groupId: string;
  type: 'single' | 'multiple' | 'scale' | 'text' | 'rating' | 'matrix' | 'ranking';
  text: string;
  helpText?: string;
  required: boolean;
  order: number;
  options?: QuestionOptionDTO[];     // For choice questions
  scaleMin?: number;                 // For scale questions
  scaleMax?: number;
  scaleLabels?: Record<number, string>;  // e.g., {1: 'Poor', 5: 'Excellent'}
  validation?: QuestionValidation;
  displayConditions?: DisplayConditionDTO[];  // Question-level conditions
}
```

### Display Condition
```typescript
interface DisplayConditionDTO {
  sourceQuestionId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'answered' | 'notAnswered';
  value?: string | number | string[];
}
```

### Survey Response
```typescript
interface SurveyResponseDTO {
  id: string;
  surveyId: string;
  respondentId?: string;   // null if anonymous
  startedAt: string;
  completedAt?: string;
  answers: AnswerDTO[];
  metadata?: Record<string, unknown>;
}

interface AnswerDTO {
  questionId: string;
  value: string | string[] | number | Record<string, string>;
  skipped: boolean;
}
```

## Conditional Logic Service

```typescript
@Injectable()
export class SurveyLogicService {
  /**
   * Evaluate if a group should be displayed based on current answers
   */
  shouldShowGroup(group: QuestionGroup, answers: Map<string, Answer>): boolean {
    if (group.displayConditions.length === 0) return true;
    
    const results = group.displayConditions.map(c => 
      this.evaluateCondition(c, answers)
    );
    
    return group.displayLogic === 'and' 
      ? results.every(r => r) 
      : results.some(r => r);
  }
  
  /**
   * Evaluate a single condition
   */
  evaluateCondition(condition: DisplayCondition, answers: Map<string, Answer>): boolean {
    const answer = answers.get(condition.sourceQuestionId);
    
    switch (condition.operator) {
      case 'equals':
        return answer?.value === condition.value;
      case 'greaterThan':
        return Number(answer?.value) > Number(condition.value);
      case 'in':
        return Array.isArray(condition.value) && 
               condition.value.includes(String(answer?.value));
      case 'answered':
        return answer !== undefined && !answer.skipped;
      // ... etc
    }
  }
  
  /**
   * Get visible questions for current state
   */
  getVisibleQuestions(survey: Survey, answers: Map<string, Answer>): SurveyQuestion[] {
    return survey.groups
      .filter(g => this.shouldShowGroup(g, answers))
      .flatMap(g => g.questions)
      .filter(q => this.shouldShowQuestion(q, answers));
  }
}
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/system/surveys` | SurveyHubComponent | List available surveys |
| `/system/surveys/take/:id` | SurveyTakeComponent | Take a survey |
| `/system/surveys/results/:id` | SurveyResultsComponent | View results |
| `/system/surveys/admin` | SurveyBrowseComponent | Manage surveys |
| `/system/surveys/admin/edit/:id` | SurveyEditComponent | Edit survey |

## Use Cases

### NPS Survey
```json
{
  "title": "How likely are you to recommend us?",
  "type": "feedback",
  "groups": [
    {
      "id": "nps",
      "questions": [{
        "id": "nps-score",
        "type": "scale",
        "text": "On a scale of 0-10, how likely are you to recommend us?",
        "scaleMin": 0,
        "scaleMax": 10,
        "scaleLabels": { "0": "Not likely", "10": "Very likely" }
      }]
    },
    {
      "id": "detractor-followup",
      "displayConditions": [{ "sourceQuestionId": "nps-score", "operator": "lessThan", "value": 7 }],
      "questions": [{
        "id": "what-went-wrong",
        "type": "text",
        "text": "We're sorry to hear that. What could we do better?"
      }]
    },
    {
      "id": "promoter-followup",
      "displayConditions": [{ "sourceQuestionId": "nps-score", "operator": "greaterThan", "value": 8 }],
      "questions": [{
        "id": "what-we-do-well",
        "type": "text",
        "text": "Thank you! What do you like most about us?"
      }]
    }
  ]
}
```

## Integration Points

- **Hub Widget**: Shows count of pending surveys
- **Onboarding**: Trigger surveys after first login
- **Support**: Post-ticket satisfaction survey
- **Feature Flags**: A/B test different survey versions
