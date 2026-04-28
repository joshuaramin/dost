import { MetaInterface } from "../meta.interface";

interface ResourceEdge<T> {
  node: ResourceInterface;
  cursor: string;
}

export interface ResourceInterface {
  resource_id: string;
  name: string;
  slug: string;
  order: number;
  parent_id: string | null;
  children?: ResourceInterface[];
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: ResourceInterface;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
    timestamp: string;
    success: boolean;
  };
}
