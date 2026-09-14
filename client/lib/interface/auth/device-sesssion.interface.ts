import { MetaInterface } from "../meta.interface";

export interface DeviceSessions {
  device_sessions_id: string;
  device_name: string;
  device_type: string;
  ip_address: string;
  os: string;
  browser: string;
  user_agent: string;
  is_deleted: boolean;
  is_revoked: boolean;
}

export interface DeviceSesssionResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: DeviceSessions;
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
