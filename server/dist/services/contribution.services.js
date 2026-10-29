"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeleteContribution = exports.UpdateContributeById = exports.CreateContribution = exports.GetContributionById = exports.GetAllContributions = void 0;
const tslib_1 = require("tslib");
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const useSlugify_1 = tslib_1.__importDefault(require("../lib/helpers/useSlugify.js"));
const ContributionManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.contribution, "contribution_id");
const GetAllContributions = async ({ after, before, classification, method: classification_method, status, type, limit, filter: { orderBy, sortBy, search }, sentiment, language, user_id, }) => {
    let where = {
        ...(sentiment && {
            sentiment,
        }),
        ...(classification && {
            classification,
        }),
        ...(classification_method && {
            classification_method,
        }),
        ...(status && {
            status,
        }),
        ...(type && {
            type,
        }),
        ...(language && {
            language: { contains: language, mode: "insensitive" },
        }),
        ...(user_id && {
            user: {
                user_id,
            },
        }),
    };
    return ContributionManage.read({
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
        select: {
            contribution_id: true,
            type: true,
            content: true,
            slug: true,
            classification: true,
            classification_method: true,
            status: true,
            is_deleted: true,
            image_url: true,
            source_url: true,
            language: true,
            review_reason: true,
            reviewed_by: true,
            reviewed_at: true,
            confidence_score: true,
            barangay: true,
            municipality: true,
            province: true,
            region: true,
            created_at: true,
            sentiment: true,
            user: true,
        },
        orderBy: {
            [orderBy]: sortBy,
        },
    });
};
exports.GetAllContributions = GetAllContributions;
const GetContributionById = async (contribution_id) => {
    return ContributionManage.readById(contribution_id, "contribution_id", {
        select: {
            contribution_id: true,
            type: true,
            content: true,
            slug: true,
            classification: true,
            classification_method: true,
            status: true,
            is_deleted: true,
            image_url: true,
            source_url: true,
            review_reason: true,
            reviewed_by: true,
            reviewed_at: true,
            confidence_score: true,
            sentiment: true,
        },
    });
};
exports.GetContributionById = GetContributionById;
const CreateContribution = async (data) => {
    return ContributionManage.create({
        content: data.content,
        slug: (0, useSlugify_1.default)(data.type),
        type: data.type,
        classification: data.classification,
        barangay: data.barangay || "",
        municipality: data.municipality || "",
        province: data.province || "",
        region: data.region || "",
        classification_method: data.classification_method,
        status: data.status,
        image_url: data.image_url,
        source_url: data.source_url,
        confidence_score: data.confidence_score,
        ...(data.attachment && {
            image_url: data.attachment,
        }),
        user: {
            connect: {
                user_id: data.user_id,
            },
        },
    });
};
exports.CreateContribution = CreateContribution;
const UpdateContributeById = async (data) => {
    console.log(data);
    return await ContributionManage.update("contribution_id", data.contribution_id, {
        status: data.status,
        classification: data.classification,
        classification_method: "MANUAL",
        language: data.language,
        review_reason: data.review_reason,
        reviewed_at: data.review_at,
        sentiment: data.sentiment,
        ...(data.status === "APPROVED" && {}),
        reviewer: {
            connect: { user_id: data.user_id },
        },
    });
};
exports.UpdateContributeById = UpdateContributeById;
const SoftDeleteContribution = async (contribution_id) => {
    return ContributionManage.delete("contribution_id", contribution_id);
};
exports.SoftDeleteContribution = SoftDeleteContribution;
