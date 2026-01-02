/**
 * Condition Evaluator Service
 * 
 * Evaluates transition conditions against workflow data.
 */
import { Injectable } from '@angular/core';
import { TransitionCondition, ConditionOperator } from '../models/workflow.model';

@Injectable({ providedIn: 'root' })
export class ConditionEvaluatorService {

  /**
   * Evaluate a condition against data
   */
  evaluate(condition: TransitionCondition, data: Record<string, unknown>): boolean {
    // Handle compound conditions
    if (condition.conditions && condition.conditions.length > 0) {
      const results = condition.conditions.map(c => this.evaluate(c, data));
      return condition.logic === 'or' 
        ? results.some(r => r) 
        : results.every(r => r);
    }

    // Get field value (supports nested paths like "user.name")
    const fieldValue = this.getFieldValue(data, condition.field);
    
    return this.evaluateOperator(condition.operator, fieldValue, condition.value);
  }

  /**
   * Get value from nested path
   */
  private getFieldValue(data: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let value: unknown = data;
    
    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = (value as Record<string, unknown>)[part];
    }
    
    return value;
  }

  /**
   * Evaluate a single operator
   */
  private evaluateOperator(
    operator: ConditionOperator, 
    fieldValue: unknown, 
    conditionValue: unknown
  ): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === conditionValue;
      
      case 'not_equals':
        return fieldValue !== conditionValue;
      
      case 'gt':
        return (fieldValue as number) > (conditionValue as number);
      
      case 'gte':
        return (fieldValue as number) >= (conditionValue as number);
      
      case 'lt':
        return (fieldValue as number) < (conditionValue as number);
      
      case 'lte':
        return (fieldValue as number) <= (conditionValue as number);
      
      case 'contains':
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(conditionValue as string);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(conditionValue);
        }
        return false;
      
      case 'not_contains':
        return !this.evaluateOperator('contains', fieldValue, conditionValue);
      
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
      
      case 'not_in':
        return !this.evaluateOperator('in', fieldValue, conditionValue);
      
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }
}
