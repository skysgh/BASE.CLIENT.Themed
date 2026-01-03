/**
 * Safe Expression Evaluator
 * 
 * Uses jsep to PARSE expressions into an AST, then interprets the AST safely.
 * NO eval(), NO new Function(), NO arbitrary code execution.
 * 
 * SUPPORTED EXPRESSIONS:
 * - Comparisons: ==, !=, <, >, <=, >=
 * - Logical: &&, ||, !
 * - Member access: user.name, item.category.id
 * - Array access: items[0], tags[index]
 * - Literals: strings, numbers, booleans, null
 * - In operator: value in ['a', 'b', 'c']
 * 
 * NOT SUPPORTED (by design):
 * - Function calls (security risk)
 * - Assignment
 * - Any form of code execution
 * 
 * USAGE:
 * ```typescript
 * const evaluator = new SafeExpressionEvaluator();
 * const context = { status: 'active', priority: 5 };
 * 
 * evaluator.evaluate("status == 'active'", context); // true
 * evaluator.evaluate("priority > 3 && status != 'closed'", context); // true
 * ```
 */

import jsep from 'jsep';

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

/**
 * Context for expression evaluation
 */
export type ExpressionContext = Record<string, unknown>;

/**
 * Result of expression evaluation
 */
export interface ExpressionResult {
  success: boolean;
  value: unknown;
  error?: string;
}

/**
 * Result of expression validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  referencedFields: string[];
}

// ═══════════════════════════════════════════════════════════════════
// Configure jsep
// ═══════════════════════════════════════════════════════════════════

// Add 'in' as a binary operator for array membership
jsep.addBinaryOp('in', 10);

// ═══════════════════════════════════════════════════════════════════
// Safe Expression Evaluator
// ═══════════════════════════════════════════════════════════════════

export class SafeExpressionEvaluator {
  private maxDepth = 10;
  private maxArrayLength = 1000;
  
  /**
   * Evaluate an expression with given context
   */
  evaluate(expression: string, context: ExpressionContext): ExpressionResult {
    if (!expression || expression.trim() === '') {
      return { success: true, value: true }; // Empty expression = true
    }
    
    try {
      const ast = jsep(expression);
      const value = this.evaluateNode(ast, context, 0);
      return { success: true, value };
    } catch (error) {
      return {
        success: false,
        value: undefined,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  /**
   * Evaluate and return boolean (with default for errors)
   */
  evaluateBool(expression: string, context: ExpressionContext, defaultValue = false): boolean {
    const result = this.evaluate(expression, context);
    if (!result.success) {
      return defaultValue;
    }
    return Boolean(result.value);
  }
  
  /**
   * Validate an expression without evaluating
   */
  validate(expression: string): ValidationResult {
    if (!expression || expression.trim() === '') {
      return { isValid: true, errors: [], referencedFields: [] };
    }
    
    try {
      const ast = jsep(expression);
      const fields = this.extractFields(ast);
      return { isValid: true, errors: [], referencedFields: fields };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : String(error)],
        referencedFields: [],
      };
    }
  }
  
  /**
   * Extract field references from expression
   */
  extractFields(node: jsep.Expression): string[] {
    const fields = new Set<string>();
    this.collectFields(node, fields);
    return Array.from(fields);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Node Evaluation
  // ═══════════════════════════════════════════════════════════════════
  
  private evaluateNode(node: jsep.Expression, context: ExpressionContext, depth: number): unknown {
    if (depth > this.maxDepth) {
      throw new Error('Expression too deeply nested');
    }
    
    switch (node.type) {
      case 'Literal':
        return (node as jsep.Literal).value;
        
      case 'Identifier':
        return this.resolveIdentifier((node as jsep.Identifier).name, context);
        
      case 'MemberExpression':
        return this.evaluateMemberExpression(node as jsep.MemberExpression, context, depth);
        
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(node as jsep.BinaryExpression, context, depth);
        
      case 'LogicalExpression':
        // jsep uses BinaryExpression for logical ops, but some versions use LogicalExpression
        return this.evaluateBinaryExpression(node as unknown as jsep.BinaryExpression, context, depth);
        
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(node as jsep.UnaryExpression, context, depth);
        
      case 'ArrayExpression':
        return this.evaluateArrayExpression(node as jsep.ArrayExpression, context, depth);
        
      case 'ConditionalExpression':
        return this.evaluateConditionalExpression(node as jsep.ConditionalExpression, context, depth);
        
      case 'CallExpression':
        throw new Error('Function calls are not allowed in expressions');
        
      case 'Compound':
        throw new Error('Multiple expressions are not allowed');
        
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }
  
  private resolveIdentifier(name: string, context: ExpressionContext): unknown {
    // Handle special literals
    if (name === 'true') return true;
    if (name === 'false') return false;
    if (name === 'null') return null;
    if (name === 'undefined') return undefined;
    
    // Resolve from context
    return context[name];
  }
  
  private evaluateMemberExpression(
    node: jsep.MemberExpression, 
    context: ExpressionContext, 
    depth: number
  ): unknown {
    const object = this.evaluateNode(node.object, context, depth + 1);
    
    if (object === null || object === undefined) {
      return undefined;
    }
    
    if (typeof object !== 'object') {
      return undefined;
    }
    
    let property: string | number;
    
    if (node.computed) {
      // Computed: obj[prop]
      const propValue = this.evaluateNode(node.property, context, depth + 1);
      if (typeof propValue === 'string' || typeof propValue === 'number') {
        property = propValue;
      } else {
        return undefined;
      }
    } else {
      // Dot notation: obj.prop
      if (node.property.type !== 'Identifier') {
        return undefined;
      }
      property = (node.property as jsep.Identifier).name;
    }
    
    // Prevent prototype pollution attacks
    if (property === '__proto__' || property === 'constructor' || property === 'prototype') {
      throw new Error('Access to prototype properties is forbidden');
    }
    
    return (object as Record<string | number, unknown>)[property];
  }
  
  private evaluateBinaryExpression(
    node: jsep.BinaryExpression, 
    context: ExpressionContext, 
    depth: number
  ): unknown {
    const operator = node.operator;
    
    // Handle logical operators with short-circuit evaluation
    if (operator === '&&') {
      const left = this.evaluateNode(node.left, context, depth + 1);
      if (!left) return false;
      return Boolean(this.evaluateNode(node.right, context, depth + 1));
    }
    
    if (operator === '||') {
      const left = this.evaluateNode(node.left, context, depth + 1);
      if (left) return true;
      return Boolean(this.evaluateNode(node.right, context, depth + 1));
    }
    
    if (operator === '??') {
      const left = this.evaluateNode(node.left, context, depth + 1);
      if (left !== null && left !== undefined) return left;
      return this.evaluateNode(node.right, context, depth + 1);
    }
    
    // Evaluate both sides for other operators
    const left = this.evaluateNode(node.left, context, depth + 1);
    const right = this.evaluateNode(node.right, context, depth + 1);
    
    switch (operator) {
      // Equality
      case '==':
      case '===':
        return left === right;
      case '!=':
      case '!==':
        return left !== right;
        
      // Comparison
      case '<':
        return (left as number) < (right as number);
      case '>':
        return (left as number) > (right as number);
      case '<=':
        return (left as number) <= (right as number);
      case '>=':
        return (left as number) >= (right as number);
        
      // Arithmetic (limited support)
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return (left as number) + (right as number);
      case '-':
        return (left as number) - (right as number);
      case '*':
        return (left as number) * (right as number);
      case '/':
        if (right === 0) throw new Error('Division by zero');
        return (left as number) / (right as number);
      case '%':
        return (left as number) % (right as number);
        
      // Custom 'in' operator
      case 'in':
        if (!Array.isArray(right)) {
          throw new Error("'in' operator requires an array on the right side");
        }
        if (right.length > this.maxArrayLength) {
          throw new Error(`Array too large for 'in' operator (max: ${this.maxArrayLength})`);
        }
        return right.includes(left);
        
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }
  
  private evaluateUnaryExpression(
    node: jsep.UnaryExpression, 
    context: ExpressionContext, 
    depth: number
  ): unknown {
    const argument = this.evaluateNode(node.argument, context, depth + 1);
    
    switch (node.operator) {
      case '!':
        return !argument;
      case '-':
        return -(argument as number);
      case '+':
        return +(argument as number);
      case 'typeof':
        return typeof argument;
      default:
        throw new Error(`Unsupported unary operator: ${node.operator}`);
    }
  }
  
  private evaluateArrayExpression(
    node: jsep.ArrayExpression, 
    context: ExpressionContext, 
    depth: number
  ): unknown[] {
    if (node.elements.length > this.maxArrayLength) {
      throw new Error(`Array literal too large (max: ${this.maxArrayLength})`);
    }
    
    return node.elements.map(element => {
      if (!element) return undefined;
      return this.evaluateNode(element, context, depth + 1);
    });
  }
  
  private evaluateConditionalExpression(
    node: jsep.ConditionalExpression, 
    context: ExpressionContext, 
    depth: number
  ): unknown {
    const test = this.evaluateNode(node.test, context, depth + 1);
    
    if (test) {
      return this.evaluateNode(node.consequent, context, depth + 1);
    } else {
      return this.evaluateNode(node.alternate, context, depth + 1);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Field Extraction
  // ═══════════════════════════════════════════════════════════════════
  
  private collectFields(node: jsep.Expression, fields: Set<string>): void {
    switch (node.type) {
      case 'Identifier':
        const name = (node as jsep.Identifier).name;
        if (!['true', 'false', 'null', 'undefined'].includes(name)) {
          fields.add(name);
        }
        break;
        
      case 'MemberExpression':
        // Get the root identifier
        const root = this.getRootIdentifier(node as jsep.MemberExpression);
        if (root) fields.add(root);
        break;
        
      case 'BinaryExpression':
      case 'LogicalExpression':
        const binary = node as jsep.BinaryExpression;
        this.collectFields(binary.left, fields);
        this.collectFields(binary.right, fields);
        break;
        
      case 'UnaryExpression':
        this.collectFields((node as jsep.UnaryExpression).argument, fields);
        break;
        
      case 'ArrayExpression':
        (node as jsep.ArrayExpression).elements.forEach(el => {
          if (el) this.collectFields(el, fields);
        });
        break;
        
      case 'ConditionalExpression':
        const cond = node as jsep.ConditionalExpression;
        this.collectFields(cond.test, fields);
        this.collectFields(cond.consequent, fields);
        this.collectFields(cond.alternate, fields);
        break;
    }
  }
  
  private getRootIdentifier(node: jsep.MemberExpression): string | null {
    let current: jsep.Expression = node;
    
    while (current.type === 'MemberExpression') {
      current = (current as jsep.MemberExpression).object;
    }
    
    if (current.type === 'Identifier') {
      return (current as jsep.Identifier).name;
    }
    
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════════

/** Default evaluator instance */
export const expressionEvaluator = new SafeExpressionEvaluator();

// ═══════════════════════════════════════════════════════════════════
// Convenience Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Evaluate an expression and return boolean
 */
export function evaluateCondition(
  expression: string, 
  context: ExpressionContext, 
  defaultValue = false
): boolean {
  return expressionEvaluator.evaluateBool(expression, context, defaultValue);
}

/**
 * Validate an expression
 */
export function validateExpression(expression: string): ValidationResult {
  return expressionEvaluator.validate(expression);
}

/**
 * Get fields referenced in an expression
 */
export function getExpressionFields(expression: string): string[] {
  const result = expressionEvaluator.validate(expression);
  return result.referencedFields;
}
