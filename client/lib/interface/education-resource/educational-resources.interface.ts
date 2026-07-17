/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetaInterface } from "../meta.interface";
import { UserInterface } from "../user/user.interface";

export interface EducationalResourceInterface {
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  category: string;
  created_at: any;
  updated_at: any;
  Author: UserInterface;
  related: {
    edges: {
      node: EducationalResourceInterface;
      cursor: string;
    }[];
  };
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

export interface EducationResourceIdInterface {
  meta: MetaInterface;
  data: EducationalResourceInterface;
}
