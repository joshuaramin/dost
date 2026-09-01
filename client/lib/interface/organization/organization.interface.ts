import { MetaInterface } from "../meta.interface";

export interface OrganizationInterface {
  organization_id: string;
  logo: string;
  name: string;
  address: string;
  contact: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: OrganizationInterface;
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
