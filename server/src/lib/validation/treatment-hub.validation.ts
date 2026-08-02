import { z } from "zod";

export const TreatmentHubSchema = z.object({
  treatment_hub_id: z.string().optional(),
  code: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  contact_number: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  operating_hours: z.string().optional(),
  latitude: z.float32().optional(),
  longitude: z.float32().optional(),
});

export const CreateTreatmentHubSchema = TreatmentHubSchema;
