import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { SurveyInterface } from "@/lib/interface/survey.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  Prisma,
  Survey,
  SurveyQuestion,
  QuestionOption,
  SurveyAnswer,
  SurveyResponse,
} from "@/lib/prisma/system/generated/prisma/client";
import { SurveyWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { AppError } from "@/lib/common/appError";
import useSlugify from "@/lib/helpers/useSlugify";

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

const QuestionOptionManage = new PrismaCRUDManager<
  QuestionOption,
  "question_option_id",
  typeof prisma.questionOption
>(prisma.questionOption, "question_option_id");

const SurveyResponseManage = new PrismaCRUDManager<
  SurveyResponse,
  "response_id",
  typeof prisma.surveyResponse
>(prisma.surveyResponse, "response_id");

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
      slug: true,
      description: true,
      created_at: true,
      updated_at: true,
      is_published: true,
      _count: true,
      questions: {
        orderBy: {
          created_at: "asc",
        },
        include: {
          options: {
            orderBy: {
              order_index: "asc",
            },
          },
        },
      },
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
          text: "",
          type: "SHORT_TEXT",
          is_required: true,
          order_index: 1,
        },
      ],
    },
  });
};

export const CreateSurveyQuestion = async (
  slug: string,
  data: Prisma.SurveyQuestionCreateInput,
) => {
  const survey = await SurveyManage.unique("slug", slug, {
    select: {
      survey_id: true,
    },
  });

  if (!survey) {
    throw new AppError("Survey not found", 404);
  }

  const latestQuestion = await QuestionnaireManage.findFirst({
    where: {
      survey_id: survey.survey_id,
      is_deleted: false,
    },
    orderBy: {
      order_index: "desc",
    },
    select: {
      order_index: true,
    },
  });

  const nextOrderIndex = (latestQuestion?.order_index ?? 0) + 1;

  return QuestionnaireManage.create({
    text: data.text ?? "",
    type: data.type ?? "SHORT_TEXT",
    is_required: false,
    is_deleted: false,
    order_index: nextOrderIndex,
    survey: {
      connect: {
        survey_id: survey.survey_id,
      },
    },
  });
};

export const DeleteSurveytQuestion = async (data: any) => {
  return QuestionnaireManage.delete(data);
};

export const UpdateSurveyQuestion = async (id: string, data: any) => {
  const question = await QuestionnaireManage.readById(id, "survey_question_id");

  if (!question) {
    throw new AppError("Survey question not found", 404);
  }

  return prisma.$transaction(async (tx) => {
    const updatedQuestion = await tx.surveyQuestion.update({
      where: {
        survey_question_id: id,
      },
      data: {
        ...(data.text !== undefined && {
          text: data.text,
        }),
        ...(data.type !== undefined && {
          type: data.type,
        }),
        ...(data.is_required !== undefined && {
          is_required: data.is_required,
        }),
        ...(data.order_index !== undefined && {
          order_index: data.order_index,
        }),
      },
    });

    const isChoiceQuestion =
      updatedQuestion.type === "MULTIPLE_CHOICE" ||
      updatedQuestion.type === "CHECKBOX";

    if (isChoiceQuestion) {
      await tx.questionOption.deleteMany({
        where: {
          survey_question_id: id,
        },
      });

      if (Array.isArray(data.options) && data.options.length > 0) {
        await tx.questionOption.createMany({
          data: data.options.map((option: any, index: number) => ({
            survey_question_id: id,
            label: option.label,
            value: useSlugify(option.label),
            order_index: option.order_index ?? index + 1,
          })),
        });
      }
    } else {
      await tx.questionOption.deleteMany({
        where: {
          survey_question_id: id,
        },
      });
    }

    return tx.surveyQuestion.findUnique({
      where: {
        survey_question_id: id,
      },
      include: {
        options: {
          orderBy: {
            order_index: "asc",
          },
        },
      },
    });
  });
};

export const CreateSurveyResponse = (data: {
  slug: string;
  answer: {
    survey_question_id: string;
    text: string;
  }[];
}) => {
  return SurveyResponseManage.create({
    answers: {
      create: data.answer.map(({ survey_question_id, text }) => ({
        survey_question_id,
        answer_text: text,
      })),
    },
    survey: {
      connect: { slug: data.slug },
    },
  });
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
