import { CreateBadge, CreateRewardLevel, CreateRewardRules, GetAllBadge, GetAllRewardLevel, GetAllRewardRules, GetBadgeById, GetRewardLevelById, } from "../services/rewards.services.js";
export const getAllBadge = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await GetAllBadge({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const getBadgeId = async (request, response) => {
    const id = String(request.params.id);
    const result = await GetBadgeById(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createBadge = async (request, response) => {
    const result = await CreateBadge();
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const getAllRewardLevel = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await GetAllRewardLevel({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const getRewardLevelById = async (request, response) => {
    const id = String(request.params.id);
    const result = await GetRewardLevelById(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
/// Reward Level
export const createReward = async (request, response) => {
    const result = await CreateRewardLevel();
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
//RuleReward
export const getAllRewardPointRule = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await GetAllRewardRules({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createRuleReward = async (request, response) => {
    const result = await CreateRewardRules();
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
