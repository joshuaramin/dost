import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { SurveyInterface } from "@/lib/interface/survey.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import { Prisma, Survey } from "@/lib/prisma/system/generated/prisma/client";
import { SurveyWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { AppError } from "@/lib/common/appError";

const SurveyManage = new PrismaCRUDManager<
  Survey,
  "survey_id",
  typeof prisma.survey
>(prisma.survey, "survey_id");

export const GetAllSurveys = ({
  limit,
  after,
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
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      survey_id: true,
      title: true,
      is_deleted: true,
      description: true,
      created_at: true,
    },
  });
};

export const GetSurveyById = async (data: any) => {
  return SurveyManage.readById(data.key, "survey_id", {
    select: {
      title: true,
      description: true,
      questions: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const CreateSurvey = async (
  data: Prisma.SurveyCreateInput & {
    questions: {
      text: string;
      type: any;
      is_required?: boolean;
      order_index?: number;
      options?: {
        label: string;
        value: string;
        order_index?: number;
      }[];
    }[];
  },
) => {
  const existingSurvey = await SurveyManage.readById(data.title, "title");

  if (existingSurvey) {
    throw new AppError("Survey with this title already exists", 400);
  }

  return SurveyManage.create({
    title: data.title,
    description: data.description,
    questions: {
      create: data.questions.map((question) => ({
        text: question.text,
        type: question.type,
        is_required: question.is_required ?? false,
        order_index: question.order_index ?? 0,
        options: {
          create: (question.options ?? []).map((option) => ({
            label: option.label,
            value: option.value,
            order_index: option.order_index ?? 0,
          })),
        },
      })),
    },
  });
};
export const UpdateSurvey = async (data: any) => {
  return SurveyManage.update("survey_id", data.key, data);
};

export const DeleteSurvey = async (data: any) => {
  return SurveyManage.delete(data.survey_id);
};
