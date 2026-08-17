import { MetaInterface } from "../meta.interface";

export type SurveyType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "MULTIPLE_CHOICE"
  | "CHECKBOX";

export interface SurveyQuestionOptionInterface {
  question_option_id: string;
  survey_question_id: string;
  label: string;
  value: string;
  order_index: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestionInterface {
  survey_question_id: string;
  survey_id: string;
  text: string;
  type: SurveyType;
  is_required: boolean;
  order_index: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  options: SurveyQuestionOptionInterface[];
}

export interface SurveyInterface {
  survey_id: string;
  title: string;
  description: string;
  slug: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  questions: SurveyQuestionInterface[];
  _count?: {
    questions: number;
    responses: number;
  };
}

export interface SurveyIDInterface {
  meta?: MetaInterface;
  data: SurveyInterface;
}

export interface CreateSurveyInterface {
  title: string;
  description: string;
}

export interface SurveyResponse {
  meta: MetaInterface;

  data: {
    edges: {
      node: SurveyInterface;
      cursor: string;
    }[];

    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };

    totalCount: number;

    timestamp: string;

    success: boolean;
  };
}
