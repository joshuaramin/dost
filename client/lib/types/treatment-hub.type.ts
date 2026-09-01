import { z } from "zod";
import CreateTreatmentHub from "../ui/dashboard/system-maintenance/treatment-hub-management/create-treatment-hub";

export type TreatmentHubFields = z.infer<typeof CreateTreatmentHub>;
