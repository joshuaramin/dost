import { MetaInterface } from "../meta.interface";

interface ResourceEdge<T> {
  node: ResourceInterface;
  cursor: string;
}

interface Permission {
  permission_id: string;
  name: string;
}
export interface ResourceInterface {
  resource_id: string;
  name: string;
  slug: string;
  order: number;
  parent_id: string | null;
  permissions: Permission[];
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
      hasNextpage: boolean;
      hasPrevPage: boolean;
    };
    totalCount: number;
    timestamp: string;
    success: boolean;
  };
}
