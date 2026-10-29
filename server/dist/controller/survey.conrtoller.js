"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surveyPublished = exports.softDeleteSurvey = exports.updateSurvey = exports.getSurvreyResponseById = exports.getSurveyById = exports.createSurveyResponse = exports.deleteSurveyQuestionBytId = exports.updateSurveyQuestionById = exports.createQuestionById = exports.createSurvey = exports.getAllSurvey = void 0;
const tslib_1 = require("tslib");
const useSlugify_1 = tslib_1.__importDefault(require("../lib/helpers/useSlugify.js"));
const survey_validation_1 = require("../lib/validation/survey.validation.js");
const survey_service_1 = require("../services/survey.service.js");
const zod_1 = require("zod");
const getAllSurvey = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before, is_published } = request.query;
    const result = await (0, survey_service_1.GetAllSurveys)({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
        is_published: Boolean(is_published),
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getAllSurvey = getAllSurvey;
const createSurvey = async (request, response) => {
    const parsedData = survey_validation_1.CreateSurveySchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, survey_service_1.CreateSurvey)({
        title: parsedData.data.title,
        description: parsedData.data.description,
        slug: (0, useSlugify_1.default)(parsedData.data.title),
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createSurvey = createSurvey;
const createQuestionById = async (request, response) => {
    const id = String(request.params.id);
    const body = request.body;
    const result = await (0, survey_service_1.CreateSurveyQuestion)(id, body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createQuestionById = createQuestionById;
const updateSurveyQuestionById = async (request, response) => {
    const id = String(request.params.id);
    const body = request.body;
    const result = await (0, survey_service_1.UpdateSurveyQuestion)(id, body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.updateSurveyQuestionById = updateSurveyQuestionById;
const deleteSurveyQuestionBytId = async (request, response) => {
    const id = String(request.params.id);
    console.log("ID: ", id);
    const result = await (0, survey_service_1.DeleteSurveytQuestion)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.deleteSurveyQuestionBytId = deleteSurveyQuestionBytId;
const createSurveyResponse = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = survey_validation_1.CreateSurveyResponseSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, survey_service_1.CreateSurveyResponse)({
        slug: id,
        answer: parsedData.data.answers.map((answer) => ({
            survey_question_id: answer.survey_question_id,
            text: answer.text ?? "",
        })),
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createSurveyResponse = createSurveyResponse;
const getSurveyById = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, survey_service_1.GetSurveyById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getSurveyById = getSurveyById;
const getSurvreyResponseById = async (request, response) => {
    const id = String(request.query.id);
    console.log("SURVEY RESPONSE: ", id);
    const result = await (0, survey_service_1.GetSurveyResponseById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getSurvreyResponseById = getSurvreyResponseById;
const updateSurvey = (request, response) => {
    const id = String(request.params.id);
};
exports.updateSurvey = updateSurvey;
const softDeleteSurvey = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, survey_service_1.SoftDeleteSurvey)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.softDeleteSurvey = softDeleteSurvey;
const surveyPublished = async (request, response) => {
    const id = String(request.params.id);
    const body = request.body;
    const result = await (0, survey_service_1.UpdateSurveyPublished)(id, body.is_published);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.surveyPublished = surveyPublished;
