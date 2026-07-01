import { MetaInterface } from "../meta.interface";

export interface EducationalResourceInterface {
  title: string;
  excerpt: string;
  content: string;
  category: string;
}

export interface EducationalResourceResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: EducationalResourceInterface;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextpage: boolean;
      hasPrevPage: boolean;
    };
    totalCount: number;
    timestamp: string;
    success: boolean;
  };
}
