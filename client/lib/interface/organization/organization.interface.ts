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
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
    timestamp: string;
    success: boolean;
  };
}
