import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const optionalNumber = z.number().int().positive().optional();

export const TreatmentHubSchema = z.object({
  treatment_hub_id: z.string().uuid().optional(),

  code: optionalString,

  name: z.string().trim().min(1, "Treatment hub name is required").max(255),

  slug: optionalString,

  description: optionalString,

  address: optionalString,

  region_ogc_fid: optionalNumber,

  province_ogc_fid: optionalNumber,

  municipality_ogc_fid: optionalNumber,

  barangay_ogc_fid: optionalNumber,

  postal_code: optionalString,

  contact_number: optionalString.refine(
    (value) =>
      !value || /^(\+63|0)9\d{9}$/.test(value) || /^[0-9\-+\s()]+$/.test(value),
    {
      message: "Invalid contact number.",
    },
  ),

  telephone: optionalString,

  email: optionalString.pipe(
    z.string().email("Invalid email address").optional(),
  ),

  website: optionalString.pipe(
    z.string().url("Invalid website URL").optional(),
  ),

  facebook: optionalString.pipe(
    z.string().url("Invalid Facebook URL").optional(),
  ),

  operating_hours: optionalString,

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),

  services: z.array(z.string()).default([]),

  populations_served: z.array(z.string()).default([]),

  status: z
    .enum(["ACTIVE", "INACTIVE", "TEMPORARILY_CLOSED"])
    .default("ACTIVE"),

  accepts_walk_in: z.boolean().default(true),

  appointment_required: z.boolean().default(false),
});

export const CreateTreatmentHubSchema = TreatmentHubSchema;
