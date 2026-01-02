/**
 * Survey Logic Service
 * 
 * Evaluates display conditions for conditional branching.
 * Determines which groups and questions should be shown based on current answers.
 */
import { Injectable } from '@angular/core';
import { DisplayConditionDTO, DisplayConditionViewModel } from '../models/display-condition.model';
import { QuestionGroupViewModel } from '../models/survey.view-model';
import { SurveyQuestionViewModel } from '../models/survey-question.view-model';
import { AnswerViewModel } from '../models/survey-response.view-model';
import { ConditionOperator } from '../constants';

@Injectable({ providedIn: 'root' })
export class SurveyLogicService {

  /**
   * Evaluate if a group should be displayed based on current answers
   */
  shouldShowGroup(
    group: QuestionGroupViewModel, 
    answers: Map<string, AnswerViewModel>
  ): boolean {
    if (group.displayConditions.length === 0) {
      return true;  // No conditions = always show
    }
    
    const results = group.displayConditions.map(c => 
      this.evaluateCondition(c, answers)
    );
    
    return group.displayLogic === 'and' 
      ? results.every(r => r) 
      : results.some(r => r);
  }

  /**
   * Evaluate if a question should be displayed based on current answers
   */
  shouldShowQuestion(
    question: SurveyQuestionViewModel, 
    answers: Map<string, AnswerViewModel>
  ): boolean {
    if (question.displayConditions.length === 0) {
      return true;  // No conditions = always show
    }
    
    const results = question.displayConditions.map(c => 
      this.evaluateCondition(c, answers)
    );
    
    return question.displayLogic === 'and' 
      ? results.every(r => r) 
      : results.some(r => r);
  }

  /**
   * Evaluate a single display condition
   */
  evaluateCondition(
    condition: DisplayConditionViewModel, 
    answers: Map<string, AnswerViewModel>
  ): boolean {
    const answer = answers.get(condition.sourceQuestionId);
    const answerValue = answer?.value;
    const conditionValue = condition.value;
    
    switch (condition.operator) {
      case 'equals':
        return this.equals(answerValue, conditionValue);
        
      case 'notEquals':
        return !this.equals(answerValue, conditionValue);
        
      case 'contains':
        return this.contains(answerValue, conditionValue);
        
      case 'notContains':
        return !this.contains(answerValue, conditionValue);
        
      case 'greaterThan':
        return this.compareNumbers(answerValue, conditionValue, (a, b) => a > b);
        
      case 'lessThan':
        return this.compareNumbers(answerValue, conditionValue, (a, b) => a < b);
        
      case 'greaterThanOrEqual':
        return this.compareNumbers(answerValue, conditionValue, (a, b) => a >= b);
        
      case 'lessThanOrEqual':
        return this.compareNumbers(answerValue, conditionValue, (a, b) => a <= b);
        
      case 'in':
        return this.isIn(answerValue, conditionValue);
        
      case 'notIn':
        return !this.isIn(answerValue, conditionValue);
        
      case 'answered':
        return answer !== undefined && !answer.skipped;
        
      case 'notAnswered':
        return answer === undefined || answer.skipped;
        
      default:
        console.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  }

  /**
   * Get all visible groups based on current answers
   */
  getVisibleGroups(
    groups: QuestionGroupViewModel[], 
    answers: Map<string, AnswerViewModel>
  ): QuestionGroupViewModel[] {
    return groups.filter(g => this.shouldShowGroup(g, answers));
  }

  /**
   * Get all visible questions based on current answers
   */
  getVisibleQuestions(
    groups: QuestionGroupViewModel[], 
    answers: Map<string, AnswerViewModel>
  ): SurveyQuestionViewModel[] {
    return this.getVisibleGroups(groups, answers)
      .flatMap(g => g.questions)
      .filter(q => this.shouldShowQuestion(q, answers));
  }

  /**
   * Calculate survey progress based on visible required questions
   */
  calculateProgress(
    groups: QuestionGroupViewModel[], 
    answers: Map<string, AnswerViewModel>
  ): { 
    visibleQuestions: number; 
    answeredQuestions: number; 
    requiredQuestions: number;
    requiredAnswered: number;
    progress: number;
    isComplete: boolean;
  } {
    const visibleQuestions = this.getVisibleQuestions(groups, answers);
    const requiredQuestions = visibleQuestions.filter(q => q.required);
    
    let answeredCount = 0;
    let requiredAnsweredCount = 0;
    
    for (const question of visibleQuestions) {
      const answer = answers.get(question.id);
      if (answer && !answer.skipped) {
        answeredCount++;
        if (question.required) {
          requiredAnsweredCount++;
        }
      }
    }
    
    const progress = requiredQuestions.length > 0
      ? Math.round((requiredAnsweredCount / requiredQuestions.length) * 100)
      : 100;
    
    return {
      visibleQuestions: visibleQuestions.length,
      answeredQuestions: answeredCount,
      requiredQuestions: requiredQuestions.length,
      requiredAnswered: requiredAnsweredCount,
      progress,
      isComplete: requiredAnsweredCount >= requiredQuestions.length,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────

  private equals(
    answerValue: string | string[] | number | Record<string, string> | undefined, 
    conditionValue: string | number | string[] | undefined
  ): boolean {
    if (answerValue === undefined) return false;
    
    // Handle array answer (multiple choice)
    if (Array.isArray(answerValue)) {
      if (Array.isArray(conditionValue)) {
        return JSON.stringify(answerValue.sort()) === JSON.stringify(conditionValue.sort());
      }
      return answerValue.includes(String(conditionValue));
    }
    
    // Handle object answer (matrix)
    if (typeof answerValue === 'object') {
      return false;  // Objects can't be directly compared
    }
    
    return String(answerValue) === String(conditionValue);
  }

  private contains(
    answerValue: string | string[] | number | Record<string, string> | undefined, 
    conditionValue: string | number | string[] | undefined
  ): boolean {
    if (answerValue === undefined) return false;
    
    if (Array.isArray(answerValue)) {
      return answerValue.includes(String(conditionValue));
    }
    
    if (typeof answerValue === 'string') {
      return answerValue.includes(String(conditionValue));
    }
    
    return false;
  }

  private compareNumbers(
    answerValue: string | string[] | number | Record<string, string> | undefined, 
    conditionValue: string | number | string[] | undefined,
    comparator: (a: number, b: number) => boolean
  ): boolean {
    if (answerValue === undefined || conditionValue === undefined) return false;
    if (Array.isArray(answerValue) || Array.isArray(conditionValue)) return false;
    if (typeof answerValue === 'object') return false;
    
    const numAnswer = Number(answerValue);
    const numCondition = Number(conditionValue);
    
    if (isNaN(numAnswer) || isNaN(numCondition)) return false;
    
    return comparator(numAnswer, numCondition);
  }

  private isIn(
    answerValue: string | string[] | number | Record<string, string> | undefined, 
    conditionValue: string | number | string[] | undefined
  ): boolean {
    if (answerValue === undefined) return false;
    if (!Array.isArray(conditionValue)) return false;
    
    const stringConditions = conditionValue.map(v => String(v));
    
    if (Array.isArray(answerValue)) {
      return answerValue.some(v => stringConditions.includes(String(v)));
    }
    
    return stringConditions.includes(String(answerValue));
  }
}
