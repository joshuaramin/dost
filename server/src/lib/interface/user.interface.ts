import { BasicArgs } from "./basicargs";

export interface UserInterface extends BasicArgs {
  organization_id: string;
  role_id: string;
}
