import { MetaInterface } from "../meta.interface";
import { Bounds } from "./country.interface";

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
