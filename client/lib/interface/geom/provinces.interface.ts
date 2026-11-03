import { MetaInterface } from "../meta.interface";
import { Bounds, Province } from "./country.interface";

export interface ProvicneProperties {
  ogc_fid: number;
  gid_1: string;
  gid_2: string;
  country: string;
  varname_1: string;
  name_1: string;
  nl_name_1: string;
  type_1: string;
  engtype_1: string;
  cc_1: string;
  hasc_1: string;
  iso_1: string;
  geo: unknown;
}
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
