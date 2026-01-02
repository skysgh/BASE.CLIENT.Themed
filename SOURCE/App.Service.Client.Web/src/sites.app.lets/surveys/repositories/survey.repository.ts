/**
 * Survey Repository
 * 
 * Data access for surveys.
 * Currently uses mock data, will connect to API.
 */
import { Injectable, signal } from '@angular/core';
import { SurveyDTO, QuestionGroupDTO } from '../models/survey.dto';
import { SurveyQuestionDTO } from '../models/survey-question.dto';

@Injectable({ providedIn: 'root' })
export class SurveyRepository {

  // Mock data for development
  private mockSurveys: SurveyDTO[] = [
    this.createNpsSurvey(),
    this.createOnboardingSurvey(),
  ];

  /**
   * Get all surveys
   */
  async getAll(): Promise<SurveyDTO[]> {
    // Simulate API delay
    await this.delay(300);
    return [...this.mockSurveys];
  }

  /**
   * Get survey by ID
   */
  async getById(id: string): Promise<SurveyDTO | null> {
    await this.delay(200);
    return this.mockSurveys.find(s => s.id === id) ?? null;
  }

  /**
   * Get active surveys for user
   */
  async getActiveForUser(userId: string): Promise<SurveyDTO[]> {
    await this.delay(300);
    return this.mockSurveys.filter(s => s.status === 'active');
  }

  /**
   * Save survey
   */
  async save(survey: SurveyDTO): Promise<SurveyDTO> {
    await this.delay(500);
    const index = this.mockSurveys.findIndex(s => s.id === survey.id);
    if (index >= 0) {
      this.mockSurveys[index] = survey;
    } else {
      this.mockSurveys.push(survey);
    }
    return survey;
  }

  /**
   * Delete survey
   */
  async delete(id: string): Promise<void> {
    await this.delay(300);
    this.mockSurveys = this.mockSurveys.filter(s => s.id !== id);
  }

  // ─────────────────────────────────────────────────────────────
  // Mock Data Factory
  // ─────────────────────────────────────────────────────────────

  private createNpsSurvey(): SurveyDTO {
    return {
      id: 'nps-2024-q1',
      title: 'How are we doing?',
      description: 'Help us improve by sharing your feedback.',
      type: 'feedback',
      status: 'active',
      allowAnonymous: true,
      requiresCompletion: false,
      estimatedMinutes: 2,
      thankYouMessage: 'Thank you for your feedback!',
      groups: [
        {
          id: 'nps-score',
          order: 1,
          displayConditions: [],
          displayLogic: 'and',
          questions: [
            {
              id: 'q-nps',
              groupId: 'nps-score',
              type: 'scale',
              text: 'How likely are you to recommend us to a friend or colleague?',
              helpText: '0 = Not at all likely, 10 = Extremely likely',
              required: true,
              order: 1,
              scaleMin: 0,
              scaleMax: 10,
              scaleLabels: { 0: 'Not at all likely', 10: 'Extremely likely' },
            }
          ],
        },
        {
          id: 'detractor-followup',
          title: 'We\'d love to understand better',
          order: 2,
          displayConditions: [
            { sourceQuestionId: 'q-nps', operator: 'lessThan', value: 7 }
          ],
          displayLogic: 'and',
          questions: [
            {
              id: 'q-improve',
              groupId: 'detractor-followup',
              type: 'text',
              textType: 'long',
              text: 'What could we do to improve your experience?',
              required: false,
              order: 1,
              placeholder: 'Tell us what went wrong...',
            }
          ],
        },
        {
          id: 'promoter-followup',
          title: 'Thank you!',
          order: 3,
          displayConditions: [
            { sourceQuestionId: 'q-nps', operator: 'greaterThanOrEqual', value: 9 }
          ],
          displayLogic: 'and',
          questions: [
            {
              id: 'q-like-most',
              groupId: 'promoter-followup',
              type: 'text',
              textType: 'long',
              text: 'What do you like most about us?',
              required: false,
              order: 1,
              placeholder: 'Share what you love...',
            }
          ],
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'system',
    };
  }

  private createOnboardingSurvey(): SurveyDTO {
    return {
      id: 'onboarding-v1',
      title: 'Tell us about yourself',
      description: 'Help us personalize your experience.',
      type: 'onboarding',
      status: 'active',
      allowAnonymous: false,
      requiresCompletion: true,
      estimatedMinutes: 3,
      groups: [
        {
          id: 'role',
          order: 1,
          displayConditions: [],
          displayLogic: 'and',
          questions: [
            {
              id: 'q-role',
              groupId: 'role',
              type: 'single',
              text: 'What best describes your role?',
              required: true,
              order: 1,
              options: [
                { id: 'dev', text: 'Developer', value: 'developer', order: 1 },
                { id: 'design', text: 'Designer', value: 'designer', order: 2 },
                { id: 'pm', text: 'Product Manager', value: 'product_manager', order: 3 },
                { id: 'exec', text: 'Executive', value: 'executive', order: 4 },
                { id: 'other', text: 'Other', value: 'other', order: 5 },
              ],
            }
          ],
        },
        {
          id: 'dev-questions',
          title: 'Developer Details',
          order: 2,
          displayConditions: [
            { sourceQuestionId: 'q-role', operator: 'equals', value: 'developer' }
          ],
          displayLogic: 'and',
          questions: [
            {
              id: 'q-languages',
              groupId: 'dev-questions',
              type: 'multiple',
              text: 'Which languages do you use?',
              required: true,
              order: 1,
              options: [
                { id: 'ts', text: 'TypeScript', value: 'typescript', order: 1 },
                { id: 'js', text: 'JavaScript', value: 'javascript', order: 2 },
                { id: 'cs', text: 'C#', value: 'csharp', order: 3 },
                { id: 'py', text: 'Python', value: 'python', order: 4 },
                { id: 'go', text: 'Go', value: 'go', order: 5 },
              ],
              allowOther: true,
            },
            {
              id: 'q-experience',
              groupId: 'dev-questions',
              type: 'scale',
              text: 'Years of experience',
              required: true,
              order: 2,
              scaleMin: 0,
              scaleMax: 20,
              scaleStep: 1,
              scaleLabels: { 0: 'New', 10: 'Senior', 20: 'Expert' },
            }
          ],
        },
        {
          id: 'goals',
          order: 3,
          displayConditions: [],
          displayLogic: 'and',
          questions: [
            {
              id: 'q-goals',
              groupId: 'goals',
              type: 'multiple',
              text: 'What are your main goals?',
              required: false,
              order: 1,
              options: [
                { id: 'learn', text: 'Learn new skills', value: 'learn', order: 1 },
                { id: 'prototype', text: 'Build prototypes', value: 'prototype', order: 2 },
                { id: 'prod', text: 'Ship to production', value: 'production', order: 3 },
                { id: 'collaborate', text: 'Collaborate with team', value: 'collaborate', order: 4 },
              ],
            }
          ],
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'system',
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
