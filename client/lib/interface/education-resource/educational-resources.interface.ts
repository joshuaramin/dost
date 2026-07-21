/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetaInterface } from "../meta.interface";
import { UserInterface } from "../user/user.interface";

enum AttachmentType {
  "IMAGE",
  "VIDEO",
  "PDF",
  "DOCUMENT",
  "AUDIO",
  "OTHER",
}

enum EducationResourceType {
  "ARTICLE",
  "VIDEO",
  "DOCUMENT",
  "CATALOGUE",
  "INFOGRAPHIC",
  "WEBINAR",
  "PODCAST",
  "EXTERNAL_LINK",
}

enum EducationStatus {
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
}

export interface EducationTagInterface {
  education_tag_id: string;
  name: string;
  slug: string;
}

export interface EducationCategoryInterace {
  education_category_id: string;
  name: string;
  slug: string;
  description: string;
  is_deleted: boolean;
}

export interface EducationAttachmentInterface {
  education_attachment_id: string;
  type: AttachmentType;
  file_name: string;
  file_url: string;
  mime_type: string;
  file_size: string;
  order_index: number;
}

export interface EducationResourceTagInterface {
  education_tag_id: string;
}

export interface EducationalResourceInterface {
  title: string;
  summary: string;
  thumbnail: string;
  is_featured: string;
  slug: string;
  content: string;
  created_at: any;
  updated_at: any;
  Author: UserInterface;
  published_at: any;
  type: string;
  tags: EducationTagInterface[];
  attachments: EducationAttachmentInterface[];
  category: EducationCategoryInterace;
  related: {
    edges: {
      node: EducationalResourceInterface;
      cursor: string;
    }[];
  };
}

export interface EducationCategoryResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: EducationCategoryInterace;
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
