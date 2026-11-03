import { MetaInterface } from "../meta.interface";

export interface TreatmenetHubServiceInterface {
  service_id: string;
  name: string;
  description: string;
}

export interface TreatmenetHubServiceResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: TreatmenetHubServiceInterface;
      cusor: string;
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
