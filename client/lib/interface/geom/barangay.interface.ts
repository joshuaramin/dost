import { MetaInterface } from "..//meta.interface";
import { Bounds } from "./country.interface";

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
