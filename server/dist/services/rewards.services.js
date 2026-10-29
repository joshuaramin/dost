"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRewardRules = exports.GetAllRewardRules = exports.CreateRewardLevel = exports.GetRewardLevelById = exports.GetAllRewardLevel = exports.SoftDeleteBadge = exports.UpdateBadge = exports.CreateBadge = exports.GetBadgeById = exports.GetAllBadge = void 0;
const tslib_1 = require("tslib");
const useCrud_1 = require("../lib/helpers/useCrud.js");
const useSlugify_1 = tslib_1.__importDefault(require("../lib/helpers/useSlugify.js"));
const prisma_1 = require("../lib/prisma/system/prisma.js");
const reward_badge_util_1 = require("../utils/reward_badge.util.js");
const RewardLevelManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.rewardLevel, "reward_level_id", false);
const BadgeManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.badge, "badge_id", false);
const UserBadgeMange = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.userBadge, "user_badge_id", false);
const RewardRulePointManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.rewardPointRule, "reward_point_rule_id", false);
const GetAllBadge = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
    let where = {
        is_active: true,
        ...(search && {
            name: { contains: search, mode: "insensitive" },
        }),
    };
    return BadgeManage.read({
        where,
        orderBy: {
            [orderBy]: sortBy,
        },
        limit,
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: after,
            direction: "forward",
        }),
        select: {
            badge_id: true,
            name: true,
            description: true,
            is_active: true,
            icon_url: true,
            requirement_type: true,
            requirement_value: true,
            slug: true,
            created_at: true,
            updated_at: true,
        },
    });
};
exports.GetAllBadge = GetAllBadge;
const GetBadgeById = (data) => {
    return BadgeManage.readById(data, "badge_id");
};
exports.GetBadgeById = GetBadgeById;
const CreateBadge = async () => {
    return Promise.all(reward_badge_util_1.badge.map(({ name, description, requirement_type, requirement_value }) => BadgeManage.create({
        name,
        description,
        requirement_type,
        requirement_value,
        slug: (0, useSlugify_1.default)(name),
        icon_url: "",
        is_active: true,
    })));
};
exports.CreateBadge = CreateBadge;
const UpdateBadge = (id, data) => {
    return BadgeManage.update("badge_id", id, data);
};
exports.UpdateBadge = UpdateBadge;
const SoftDeleteBadge = (data) => {
    return BadgeManage.delete("badge_id", data);
};
exports.SoftDeleteBadge = SoftDeleteBadge;
const GetAllRewardLevel = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
    let where = {
        is_active: true,
    };
    return RewardLevelManage.read({
        where,
        limit,
        orderBy: {
            [orderBy]: sortBy,
        },
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: after,
            direction: "forward",
        }),
        select: {
            reward_level_id: true,
            name: true,
            description: true,
            is_active: true,
            min_points: true,
            order_index: true,
            created_at: true,
        },
    });
};
exports.GetAllRewardLevel = GetAllRewardLevel;
const GetRewardLevelById = (data) => {
    return RewardLevelManage.readById(data, "reward_level_id", {
        select: {
            name: true,
            description: true,
            is_active: true,
            min_points: true,
            order_index: true,
        },
    });
};
exports.GetRewardLevelById = GetRewardLevelById;
const CreateRewardLevel = () => {
    return Promise.all(reward_badge_util_1.Reward.map(({ name, description, min_points }, index) => {
        RewardLevelManage.create({
            name,
            min_points,
            description,
            order_index: index,
        });
    }));
};
exports.CreateRewardLevel = CreateRewardLevel;
const GetAllRewardRules = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
    let where = {
        is_active: true,
    };
    return RewardRulePointManage.read({
        where,
        orderBy: {
            [orderBy]: sortBy,
        },
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: before,
            direction: "backward",
        }),
        limit,
    });
};
exports.GetAllRewardRules = GetAllRewardRules;
const CreateRewardRules = () => {
    return Promise.all(reward_badge_util_1.Rule.map(({ action_type, is_active, points }) => {
        RewardRulePointManage.create({
            action_type,
            is_active,
            points,
        });
    }));
};
exports.CreateRewardRules = CreateRewardRules;
