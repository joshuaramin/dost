import { MetaInterface } from "../meta.interface";
import { Bounds } from "./country.interface";

export interface MunicipalitiesProperties {
  ogc_fid: string;
  geom: unknown;
  gid_2: string;
  gid_0: string;
  country: string;
  gid_1: string;
  name_1: string;
  nl_name_1: string;
  name_2: string;
  varname_2: string;
  nl_name_2: string;
  type_2: string;
  engtype_2: string;
  cc_2: string;
  hasc_2: string;
}
export interface MunicipalitiesInterface {
  id: string;
  code: string;
  name: string;
  bound: Bounds;
}

export interface MunicipalitiesInterfaceResult {
  meta: MetaInterface;
  data: {
    data: MunicipalitiesInterface[];
  };
}
