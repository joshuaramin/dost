import useSlugify from "@/lib/helpers/useSlugify";

import {
  CreateSurveyResponseSchema,
  CreateSurveySchema,
} from "@/lib/validation/survey.validation";

import {
  CreateSurvey,
  CreateSurveyQuestion,
  CreateSurveyResponse,
  DeleteSurveytQuestion,
  GetAllSurveys,
  GetSurveyById,
  UpdateSurveyPublished,
  UpdateSurveyQuestion,
} from "@/services/survey.service";

import { Request, Response } from "express";

import { z } from "zod";

export const getAllSurvey = async (request: Request, response: Response) => {
  const { after, orderBy, search, sortBy, limit, before } = request.query;

  const result = await GetAllSurveys({
    after: after as string,
    before: before as string,
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
    slug: useSlugify(parsedData.data.title),
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createQuestionById = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);

  const body = request.body;

  const result = await CreateSurveyQuestion(id, body);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const updateSurveyQuestionById = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);

  const body = request.body;

  const result = await UpdateSurveyQuestion(id, body);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const deleteSurveyQuestionBytId = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);

  console.log("ID: ", id);

  const result = await DeleteSurveytQuestion(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createSurveyResponse = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);
  const parsedData = CreateSurveyResponseSchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = await CreateSurveyResponse({
    slug: id,
    answer: parsedData.data.answers.map((answer) => ({
      survey_question_id: answer.question_id,
      text: answer.text ?? "",
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

const surveyPublished = async (request: Request, response: Response) => {
  const id = String(request.params.id);

  const body = request.body;

  const result = await UpdateSurveyPublished(id, body.is_published);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
