import { MetaInterface } from "../meta.interface";

export interface RolesAndPermissionsInterface {
  role_id: string;
  name: string;
  slug: string;
  description: string;
  rolePermissions: Array<{
    permission_id: string;
    name: string;
    Permission: { name: string };
  }>;
  is_deleted: boolean;
  created_at: boolean;
  updated_at: boolean;
}

export interface RoleIDInterface {
  data: RolesAndPermissionsInterface;
}

export interface RolesAndPermissionResponse {
  meta: MetaInterface;
  data: {
    edges: {
      node: RolesAndPermissionsInterface;
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
