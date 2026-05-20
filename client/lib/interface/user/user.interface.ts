import { MetaInterface } from "../meta.interface";
import { OrganizationInterface } from "../organization/organization.interface";
import { RolesAndPermissionsInterface } from "../roles-and-permissions/roles-and-permission";

export interface ProfileInterface {
  first_name: string;
  last_name: string;
}
export interface UserInterface {
  user_id: string;
  email: string;
  is_deleted: boolean;
  created_at: string;
  updated: string;
  Profile: ProfileInterface;
  role: RolesAndPermissionsInterface;
  organization: OrganizationInterface;
}

export interface UserResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: UserInterface;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextpage: boolean;
    };
    totalCount: number;
    timestamp: string;
    success: boolean;
  };
}
