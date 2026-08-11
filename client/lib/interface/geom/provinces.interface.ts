import { MetaInterface } from "../meta.interface";
import { Bounds, Province } from "./country.interface";

export interface ProvinceInterface {
  id: string;
  code: string;
  name: string;
  bound: Bounds;
}

export interface ProvinceInterfaceResult {
  meta: MetaInterface;
  data: {
    data: ProvinceInterface[];
  };
}
