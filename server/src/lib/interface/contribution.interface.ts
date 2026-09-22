import { BasicArgs } from "./basicargs";

export interface ContributionInterface extends BasicArgs {
  method: string;
  type: string;
  status: string;
  classification: string;
  language: string;
  sentiment: string;
  user_id: string;
}
