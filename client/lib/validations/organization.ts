import z from "zod";

export const OrganizationSchema = z.object({
  logo: z.file().min(1, "Upload at least one"),
  name: z.string().min(1, "Organizatoin name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact Number is required"),
});
