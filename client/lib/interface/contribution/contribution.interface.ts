import { MetaInterface } from "../meta.interface";

enum Classification {
  PENDING,
  MISINFORMATION,
  FACTUAL,
}

enum ClassificationMethod {
  MANUAL,
  AI,
  HYBRID,
}

export interface ContributionInterface {
  contribution_id: string;
  type: string;
  slug: string;
  content: string;
  status: string;
  is_deleted: boolean;
  image_url: string;
  source_url: string;
  classification: Classification;
  region: string;
  municipality: string;
  province: string;
  barangay: string;
  classification_method: ClassificationMethod;
  confidence_score: string;
  reviewed_by: string;
  reviewed_at: string;
}

export interface ContributionIdInterface {
  meta: MetaInterface;
  data: ContributionInterface;
}

export interface ContributionResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: ContributionInterface;
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
