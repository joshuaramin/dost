import { MetaInterface } from "../meta.interface";
import { UserInterface } from "../user/user.interface";

export interface FormManagementDataInterface {
  form_id: string;
  type: string;
  description: string;
  image_url: string;
  is_deleted: boolean;
  user: UserInterface;
  updated_at: any;
  created_at: any;
}
export interface FormManagementInterfaceResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: FormManagementDataInterface;
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
