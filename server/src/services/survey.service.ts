import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { SurveyInterface } from "@/lib/interface/survey.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  Prisma,
  Survey,
  SurveyQuestion,
} from "@/lib/prisma/system/generated/prisma/client";
import { SurveyWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { AppError } from "@/lib/common/appError";

const SurveyManage = new PrismaCRUDManager<
  Survey,
  "survey_id",
  typeof prisma.survey
>(prisma.survey, "survey_id");

const QuestionnaireManage = new PrismaCRUDManager<
  SurveyQuestion,
  "survey_question_id",
  typeof prisma.surveyQuestion
>(prisma.surveyQuestion, "survey_question_id");

export const GetAllSurveys = ({
  limit,
  after,
  before,
  filter: { orderBy, search, sortBy },
}: SurveyInterface) => {
  let where: SurveyWhereInput = {
    is_deleted: false,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };
  return SurveyManage.read({
    where,
    limit,
    ...(after && {
      cursor: after,
      direction: "forward",
    }),
    ...(before && {
      cursor: before,
      direction: "backward",
    }),
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      survey_id: true,
      title: true,
      slug: true,
      is_deleted: true,
      description: true,
      created_at: true,
      questions: {
        where: {
          is_deleted: false,
        },
        include: {
          options: true,
        },
      },
    },
  });
};

export const GetSurveyById = async (data: any) => {
  return await SurveyManage.readById(data, "slug", {
    select: {
      survey_id: true,
      title: true,
      description: true,
      questions: {
        include: { options: true },
      },
      created_at: true,
      updated_at: true,
      is_published: true,
      _count: true,
    },
  });
};

export const CreateSurvey = async (data: Prisma.SurveyCreateInput) => {
  const existingSurvey = await SurveyManage.readById(data.title, "title");

  if (existingSurvey) {
    throw new AppError("Survey with this title already exists", 400);
  }

  return SurveyManage.create({
    title: data.title,
    description: data.description,
    slug: data.slug,
    questions: {
      create: [
        {
          text: "Testing questionnaire",
          type: "SHORT_TEXT",
          is_required: false,
          order_index: 1,
        },
      ],
    },
  });
};
export const CreateSurveyQuestion = async (id: string, data: any) => {
  return QuestionnaireManage.create({
    text: "",
    type: "SHORT_TEXT",
    is_deleted: false,
    order_index: data.index,
    survey: {
      connect: { slug: id },
    },
  });
};

export const DeleteSurveytQuestion = async (data: any) => {
  console.log(data);
  return QuestionnaireManage.delete(data);
};

export const UpdateSurvey = async (data: any) => {
  return SurveyManage.update("survey_id", data.key, data);
};

export const DeleteSurvey = async (data: any) => {
  return SurveyManage.delete(data.survey_id);
};

export const UpdateSurveyPublished = async (id: string, data: boolean) => {
  return SurveyManage.update("slug", id, {
    is_published: data,
  });
};
