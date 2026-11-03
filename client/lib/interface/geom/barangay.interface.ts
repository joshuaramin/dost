import { MetaInterface } from "..//meta.interface";
import { TreatmentHubInterface } from "../treatment-hub/treatment-hub.interface";
import { Bounds } from "./country.interface";
import { MunicipalitiesProperties } from "./municipalities.interface";

export interface BarangyasPropereties {
  ogc_fid: string;
  geom: unknown;
  gid_3: string;
  gid_0: string;
  country: string;
  gid_1: string;
  name_1: string;
  nl_name_1: string;
  gid_2: string;
  name_2: string;
  nl_name_2: string;
  name_3: string;
  varname_3: string;
  nl_name_3: string;
  type_3: string;
  engtype_3: string;
  cc_3: string;
  hasc_3: string;
  municipalities: MunicipalitiesProperties;
  treatmentHubs: TreatmentHubInterface[];
}

export interface BarangayInterface {
  id: string;
  code: string;
  name: string;
  bound: Bounds;
}

export interface BarangayInterfaceResult {
  meta: MetaInterface;
  data: {
    data: BarangayInterface[];
  };
}
