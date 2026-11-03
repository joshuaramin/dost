import { MetaInterface } from "../meta.interface";
import { UserInterface } from "../user/user.interface";

export interface VerifyResponse {
  meta: MetaInterface;
  data: {
    token: string;
    user: UserInterface;
  };
}
