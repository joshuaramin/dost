import { MetaInterface } from "../meta.interface";

export interface SurveyInterface {
  survey_id: string;
  title: string;
  description: string;
  slug: string;
  is_deleted?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
}

export interface CreateSurveyInterface {
  title: string;
  description: string;
}

export interface SurveyIDInterface {
  data: SurveyInterface;
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
