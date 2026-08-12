import { MetaInterface } from "../meta.interface";

export interface ActivityLogsInterface {
  activity_logs_id: string;
  type: string;
  description: string;
  is_deleted: boolean;
  created_at: unknown;
  updated_at: unknown;
}

export interface ActivityLogsInterfaceResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: ActivityLogsInterface[];
      cursor: string;
    };
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
}
