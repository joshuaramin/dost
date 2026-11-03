import { MetaInterface } from "../meta.interface";
import { Bounds } from "./country.interface";

export interface RegionProperties {
  region_id: string;
  psgc_code: string;
  name: string;
  geom: unknown;
}

export interface RegionsInterface {
  id: number;
  code: string;
  name: string;
  bound: Bounds;
}

export interface RegionsInterfaceResult {
  meta: MetaInterface;
  data: {
    data: RegionsInterface[];
  };
}
