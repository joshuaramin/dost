import { BasicArgs } from "./basicargs.js";

export interface UserInterface extends BasicArgs {
  organization_id: string;
  role_id: string;
}
