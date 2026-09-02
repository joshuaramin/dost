import { z } from "zod";
import { CreateTreatmentHubSchema } from "../validations/treatment-hub.validation";

export type TreatmentHubFields = z.infer<typeof CreateTreatmentHubSchema>;
