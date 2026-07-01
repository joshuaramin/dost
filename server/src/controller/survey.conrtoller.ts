import { CreateSurveySchema } from "@/lib/validation/survey.validation";
import {
  CreateSurvey,
  GetAllSurveys,
  GetSurveyById,
} from "@/services/survey.service";
import { Request, Response } from "express";
import { z } from "zod";

export const getAllSurvey = async (request: Request, response: Response) => {
  const { after, orderBy, search, sortBy, limit } = request.query;

  const result = await GetAllSurveys({
    after: after as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createSurvey = async (request: Request, response: Response) => {
  const parsedData = CreateSurveySchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = await CreateSurvey({
    title: parsedData.data.title,
    description: parsedData.data.description,
    questions: parsedData.data.questions.map((question) => ({
      text: question.text,
      type: question.type,
      is_required: question.is_required,
      order_index: question.order_index,
      options: question.options?.map((option) => ({
        label: option.label,
        value: option.value,
        order_index: option.order_index,
      })),
    })),
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getSurveyById = async (request: Request, response: Response) => {
  const id = String(request.params.id);
  const result = await GetSurveyById(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const updateSurvey = (request: Request, response: Response) => {
  const id = String(request.params.id);
};

export const softDeleteSurvey = (request: Request, response: Response) => {};
