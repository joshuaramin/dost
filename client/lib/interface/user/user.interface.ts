import { ActivityLogsInterface } from "../activitiy-logs/activity-log.interface";
import { DeviceSessionsInterface } from "../deviceSessions/device-sessions.interface";
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
  is_active: boolean;
  created_at: string;
  updated: string;
  Profile: ProfileInterface;
  role: RolesAndPermissionsInterface;
  organization: OrganizationInterface;
  ActivityLog: ActivityLogsInterface[];
  DeviceSession: DeviceSessionsInterface[];
}

export interface UserByIdInterface {
  meta: MetaInterface;
  data: UserInterface;
}
export interface UserResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: UserInterface;
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
