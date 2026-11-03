import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
import { AppError } from "../lib/common/appError.js";
import useSlugify from "../lib/helpers/useSlugify.js";
const SurveyManage = new PrismaCRUDManager(prisma.survey, "survey_id");
const QuestionnaireManage = new PrismaCRUDManager(prisma.surveyQuestion, "survey_question_id");
const QuestionOptionManage = new PrismaCRUDManager(prisma.questionOption, "question_option_id");
const SurveyAnswerManage = new PrismaCRUDManager(prisma.surveyAnswer, "answer_id", false);
const SurveyResponseManage = new PrismaCRUDManager(prisma.surveyResponse, "response_id", false);
export const GetAllSurveys = ({ limit, after, before, is_published, filter: { orderBy, search, sortBy }, }) => {
    let where = {
        is_deleted: false,
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ],
        }),
        ...(is_published === true && {
            is_published: true,
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
            is_published: true,
            questions: {
                where: {
                    is_deleted: false,
                },
                include: {
                    options: true,
                },
            },
            responses: {
                select: { _count: true },
            },
            _count: true,
        },
    });
};
export const GetSurveyById = async (data) => {
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
                    answers: {
                        select: {
                            answer_text: true,
                            response: { select: { _count: true } },
                        },
                    },
                    options: {
                        orderBy: {
                            order_index: "asc",
                        },
                    },
                },
            },
            responses: {
                select: { _count: true },
            },
        },
    });
};
export const GetSurveyResponseById = async (data) => {
    console.log("ID: ", data);
    return SurveyManage.readById(data.id, "survey_id", {
        select: {
            questions: {
                select: {
                    survey_question_id: true,
                    text: true,
                    answers: {
                        select: { answer_text: true },
                    },
                },
            },
        },
    });
};
export const CreateSurvey = async (data) => {
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
export const CreateSurveyQuestion = async (slug, data) => {
    const survey = await SurveyManage.unique("slug", slug, {
        select: {
            survey_id: true,
        },
    });
    console.log(survey);
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
export const DeleteSurveytQuestion = async (data) => {
    return QuestionnaireManage.delete("survey_question_id", data);
};
export const UpdateSurveyQuestion = async (id, data) => {
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
        const isChoiceQuestion = updatedQuestion.type === "MULTIPLE_CHOICE" ||
            updatedQuestion.type === "CHECKBOX";
        if (isChoiceQuestion) {
            await tx.questionOption.deleteMany({
                where: {
                    survey_question_id: id,
                },
            });
            if (Array.isArray(data.options) && data.options.length > 0) {
                await tx.questionOption.createMany({
                    data: data.options.map((option, index) => ({
                        survey_question_id: id,
                        label: option.label,
                        value: useSlugify(option.label),
                        order_index: option.order_index ?? index + 1,
                    })),
                });
            }
        }
        else {
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
export const CreateSurveyResponse = (data) => {
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
export const UpdateSurvey = async (data) => {
    return SurveyManage.update("survey_id", data.key, data);
};
export const SoftDeleteSurvey = async (data) => {
    return SurveyManage.delete("survey_id", data);
};
export const UpdateSurveyPublished = async (id, data) => {
    return SurveyManage.update("slug", id, {
        is_published: data,
    });
};
