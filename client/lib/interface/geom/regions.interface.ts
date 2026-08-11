import { MetaInterface } from "../meta.interface";
import { Bounds } from "./country.interface";

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
