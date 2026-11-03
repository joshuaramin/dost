import z from "zod";

export const ActivityLogsSchema = z.object({
  type: z.string().min(1, "Type is requireds"),
  description: z.string().min(1, "Description is required"),
  user_id: z.string().min(1, "User ID is required"),
});

export const CreateActivityLog = ActivityLogsSchema;
