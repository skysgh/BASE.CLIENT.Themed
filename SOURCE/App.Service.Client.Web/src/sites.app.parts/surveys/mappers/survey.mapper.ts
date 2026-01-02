/**
 * Survey Mapper
 * 
 * Maps between DTO and ViewModel for Survey entities.
 */
import { 
  SURVEY_TYPE_LABELS, 
  SURVEY_STATUS_LABELS, 
  SURVEY_STATUS_COLORS,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_ICONS,
  CONDITION_OPERATOR_LABELS
} from '../constants';
import { SurveyDTO, QuestionGroupDTO } from '../models/survey.dto';
import { SurveyViewModel, QuestionGroupViewModel } from '../models/survey.view-model';
import { SurveyQuestionDTO } from '../models/survey-question.dto';
import { SurveyQuestionViewModel } from '../models/survey-question.view-model';
import { DisplayConditionDTO, DisplayConditionViewModel } from '../models/display-condition.model';

export class SurveyMapper {

  /**
   * Map Survey DTO to ViewModel
   */
  static toViewModel(dto: SurveyDTO): SurveyViewModel {
    const groups = dto.groups.map(g => this.mapGroup(g));
    const allQuestions = groups.flatMap(g => g.questions);
    const visibleQuestions = allQuestions.filter(q => q.isAnswered || !q.hasConditions);
    const requiredQuestions = allQuestions.filter(q => q.required);
    
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    const now = new Date();
    
    const isWithinDateRange = 
      (!startDate || now >= startDate) && 
      (!endDate || now <= endDate);
    
    const daysRemaining = endDate 
      ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      typeLabel: SURVEY_TYPE_LABELS[dto.type],
      status: dto.status,
      statusLabel: SURVEY_STATUS_LABELS[dto.status],
      statusColor: SURVEY_STATUS_COLORS[dto.status],
      
      startDate,
      endDate,
      isOpen: dto.status === 'active' && isWithinDateRange,
      daysRemaining: daysRemaining && daysRemaining > 0 ? daysRemaining : undefined,
      
      allowAnonymous: dto.allowAnonymous,
      requiresCompletion: dto.requiresCompletion,
      maxResponses: dto.maxResponses,
      isFull: false,  // Will be computed when response count is known
      estimatedMinutes: dto.estimatedMinutes,
      thankYouMessage: dto.thankYouMessage,
      redirectUrl: dto.redirectUrl,
      
      groups,
      
      totalQuestions: allQuestions.length,
      visibleQuestions: visibleQuestions.length,
      answeredQuestions: 0,
      requiredQuestions: requiredQuestions.length,
      requiredAnswered: 0,
      progress: 0,
      isComplete: false,
      
      createdAt: new Date(dto.createdAt),
      createdBy: dto.createdBy,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      
      metadata: dto.metadata,
    };
  }

  /**
   * Map Question Group DTO to ViewModel
   */
  static mapGroup(dto: QuestionGroupDTO): QuestionGroupViewModel {
    const questions = dto.questions.map(q => this.mapQuestion(q));
    
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      order: dto.order,
      displayConditions: dto.displayConditions.map(c => this.mapCondition(c)),
      displayLogic: dto.displayLogic,
      questions,
      
      hasConditions: dto.displayConditions.length > 0,
      isVisible: dto.displayConditions.length === 0,  // Default visible if no conditions
      questionCount: questions.length,
      answeredCount: 0,
      progress: 0,
    };
  }

  /**
   * Map Survey Question DTO to ViewModel
   */
  static mapQuestion(dto: SurveyQuestionDTO): SurveyQuestionViewModel {
    const scaleMin = dto.scaleMin ?? 1;
    const scaleMax = dto.scaleMax ?? 5;
    const scaleStep = dto.scaleStep ?? 1;
    const ratingMax = dto.ratingMax ?? 5;
    
    return {
      id: dto.id,
      groupId: dto.groupId,
      type: dto.type,
      typeLabel: QUESTION_TYPE_LABELS[dto.type],
      typeIcon: QUESTION_TYPE_ICONS[dto.type],
      text: dto.text,
      helpText: dto.helpText,
      required: dto.required,
      order: dto.order,
      
      options: (dto.options ?? []).map(o => ({
        ...o,
        isSelected: false,
      })),
      allowOther: dto.allowOther ?? false,
      randomizeOptions: dto.randomizeOptions ?? false,
      
      scaleMin,
      scaleMax,
      scaleLabels: dto.scaleLabels ?? {},
      scaleStep,
      scaleValues: this.generateScaleValues(scaleMin, scaleMax, scaleStep),
      
      ratingStyle: dto.ratingStyle ?? 'stars',
      ratingMax,
      ratingValues: Array.from({ length: ratingMax }, (_, i) => i + 1),
      
      textType: dto.textType ?? 'short',
      placeholder: dto.placeholder,
      
      matrixRows: dto.matrixRows ?? [],
      matrixColumns: dto.matrixColumns ?? [],
      
      validation: dto.validation ?? {},
      
      displayConditions: (dto.displayConditions ?? []).map(c => this.mapCondition(c)),
      displayLogic: dto.displayLogic ?? 'and',
      hasConditions: (dto.displayConditions ?? []).length > 0,
      
      isAnswered: false,
      isValid: true,
      validationErrors: [],
    };
  }

  /**
   * Map Display Condition DTO to ViewModel
   */
  static mapCondition(dto: DisplayConditionDTO): DisplayConditionViewModel {
    return {
      sourceQuestionId: dto.sourceQuestionId,
      operator: dto.operator,
      operatorLabel: CONDITION_OPERATOR_LABELS[dto.operator],
      value: dto.value,
    };
  }

  /**
   * Generate scale values array
   */
  private static generateScaleValues(min: number, max: number, step: number): number[] {
    const values: number[] = [];
    for (let i = min; i <= max; i += step) {
      values.push(i);
    }
    return values;
  }

  /**
   * Map ViewModel back to DTO (for saving)
   */
  static toDTO(vm: SurveyViewModel): SurveyDTO {
    return {
      id: vm.id,
      title: vm.title,
      description: vm.description,
      type: vm.type,
      status: vm.status,
      startDate: vm.startDate?.toISOString(),
      endDate: vm.endDate?.toISOString(),
      allowAnonymous: vm.allowAnonymous,
      requiresCompletion: vm.requiresCompletion,
      maxResponses: vm.maxResponses,
      estimatedMinutes: vm.estimatedMinutes,
      thankYouMessage: vm.thankYouMessage,
      redirectUrl: vm.redirectUrl,
      groups: vm.groups.map(g => this.groupToDTO(g)),
      metadata: vm.metadata,
      createdAt: vm.createdAt.toISOString(),
      createdBy: vm.createdBy,
      updatedAt: vm.updatedAt?.toISOString(),
    };
  }

  /**
   * Map Group ViewModel to DTO
   */
  private static groupToDTO(vm: QuestionGroupViewModel): QuestionGroupDTO {
    return {
      id: vm.id,
      title: vm.title,
      description: vm.description,
      order: vm.order,
      displayConditions: vm.displayConditions.map(c => ({
        sourceQuestionId: c.sourceQuestionId,
        operator: c.operator,
        value: c.value,
      })),
      displayLogic: vm.displayLogic,
      questions: vm.questions.map(q => this.questionToDTO(q)),
    };
  }

  /**
   * Map Question ViewModel to DTO
   */
  private static questionToDTO(vm: SurveyQuestionViewModel): SurveyQuestionDTO {
    return {
      id: vm.id,
      groupId: vm.groupId,
      type: vm.type,
      text: vm.text,
      helpText: vm.helpText,
      required: vm.required,
      order: vm.order,
      options: vm.options.map(({ isSelected, ...o }) => o),
      allowOther: vm.allowOther,
      randomizeOptions: vm.randomizeOptions,
      scaleMin: vm.scaleMin,
      scaleMax: vm.scaleMax,
      scaleLabels: vm.scaleLabels,
      scaleStep: vm.scaleStep,
      ratingStyle: vm.ratingStyle,
      ratingMax: vm.ratingMax,
      textType: vm.textType,
      placeholder: vm.placeholder,
      matrixRows: vm.matrixRows,
      matrixColumns: vm.matrixColumns,
      validation: vm.validation,
      displayConditions: vm.displayConditions.map(c => ({
        sourceQuestionId: c.sourceQuestionId,
        operator: c.operator,
        value: c.value,
      })),
      displayLogic: vm.displayLogic,
    };
  }
}
