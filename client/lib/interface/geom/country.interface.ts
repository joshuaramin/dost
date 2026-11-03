import { MetaInterface } from "../meta.interface";

export interface Bounds {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface Barangay {
  barangay_code: string;
  barangay_name: string;
  bounds: Bounds;
}

export interface Municipality {
  municipality_code: string;
  municipality_name: string;
  bounds: Bounds;
  barangays: Barangay[];
}

export interface Province {
  province_code: string;
  province_name: string;
  bounds: Bounds;
  municipalities: Municipality[];
}

export interface Region {
  region_code: string;
  region_name: string;
  bounds: Bounds;
  provinces: Province[];
}

export interface LocationHierarchyResult {
  meta: MetaInterface;
  data: {
    data: Region[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    totalCount: number;
    timestamp: string;
    success: boolean;
  };
}
