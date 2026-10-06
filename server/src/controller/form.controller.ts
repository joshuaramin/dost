import { FormSchema } from "@/lib/validation/form.validation";
import { CreateForm, GetAllForm, GetFormById } from "@/services/form.services";

import { Request, Response } from "express";
import { z } from "zod";

export const getAllForms = async (request: Request, response: Response) => {
  const { limit, after, orderBy, sortBy, search, before, type } = request.query;

  const result = await GetAllForm({
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
    type: type as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getFormById = async (request: Request, response: Response) => {
  const id = String(request.params.id);
  const result = await GetFormById(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createForm = async (request: Request, response: Response) => {
  const parsedData = FormSchema.safeParse(request.body);

  const file = request.file as Express.MulterS3.File | undefined;

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = await CreateForm({
    ...parsedData.data,
    ...(file?.key
      ? {
          image_url: `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/advocaid/${file.key}`,
        }
      : {}),
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
