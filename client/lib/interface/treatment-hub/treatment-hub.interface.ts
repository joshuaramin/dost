import { MetaInterface } from "../meta.interface";

export type TreatmentHubStatus = "ACTIVE" | "INACTIVE" | "TEMPORARILY_CLOSED";

export type TreatmentHubService =
  | "HIV_TESTING"
  | "ART"
  | "PREP"
  | "PEP"
  | "TB_SCREENING"
  | "STI_SCREENING"
  | "CD4_TESTING"
  | "VIRAL_LOAD_TESTING"
  | "COUNSELING"
  | "CASE_MANAGEMENT"
  | "PMTCT";

export type PopulationServed =
  | "GENERAL_POPULATION"
  | "MSM"
  | "TGW"
  | "PWID"
  | "FSW"
  | "ADOLESCENTS"
  | "PREGNANT_WOMEN"
  | "CHILDREN";

export interface TreatmentHubInterface {
  treatment_hub_id: string;
  code: string;
  name: string;
  slug: string;

  description?: string;

  address?: string;

  region_code: string;
  region_name: string;

  province_code: string;
  province_name: string;

  municipality_code: string;
  municipality_name: string;

  barangay_code: string;
  barangay_name: string;

  postal_code?: string;

  contact_number?: string;
  telephone?: string;
  email?: string;
  website?: string;
  facebook?: string;

  operating_hours?: string;

  latitude: number;
  longitude: number;

  services: TreatmentHubService[];

  populations_served: PopulationServed[];

  status: TreatmentHubStatus;

  is_doh_accredited: boolean;
  accepts_walk_in: boolean;
  appointment_required: boolean;

  has_hiv_testing: boolean;
  has_art: boolean;
  has_prep: boolean;
  has_pep: boolean;
  has_cd4_testing: boolean;
  has_viral_load_testing: boolean;

  is_deleted: boolean;

  created_at: string;
  updated_at: string;
}

export interface TreatmentHubResult {
  meta: MetaInterface;
  data: {
    edges: {
      node: TreatmentHubInterface;
      cursor: string;
    }[];
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
