"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRuleReward = exports.getAllRewardPointRule = exports.createReward = exports.getRewardLevelById = exports.getAllRewardLevel = exports.createBadge = exports.getBadgeId = exports.getAllBadge = void 0;
const rewards_services_1 = require("../services/rewards.services.js");
const getAllBadge = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await (0, rewards_services_1.GetAllBadge)({
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
exports.getAllBadge = getAllBadge;
const getBadgeId = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, rewards_services_1.GetBadgeById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getBadgeId = getBadgeId;
const createBadge = async (request, response) => {
    const result = await (0, rewards_services_1.CreateBadge)();
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createBadge = createBadge;
const getAllRewardLevel = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await (0, rewards_services_1.GetAllRewardLevel)({
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
exports.getAllRewardLevel = getAllRewardLevel;
const getRewardLevelById = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, rewards_services_1.GetRewardLevelById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getRewardLevelById = getRewardLevelById;
/// Reward Level
const createReward = async (request, response) => {
    const result = await (0, rewards_services_1.CreateRewardLevel)();
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createReward = createReward;
//RuleReward
const getAllRewardPointRule = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await (0, rewards_services_1.GetAllRewardRules)({
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
exports.getAllRewardPointRule = getAllRewardPointRule;
const createRuleReward = async (request, response) => {
    const result = await (0, rewards_services_1.CreateRewardRules)();
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createRuleReward = createRuleReward;
