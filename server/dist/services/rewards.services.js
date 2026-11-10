import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import useSlugify from "../lib/helpers/useSlugify.js";
import { prisma } from "../lib/prisma/system/prisma.js";
import { Reward, badge, Rule } from "../utils/reward_badge.util.js";
const RewardLevelManage = new PrismaCRUDManager(prisma.rewardLevel, "reward_level_id", false);
const BadgeManage = new PrismaCRUDManager(prisma.badge, "badge_id", false);
const UserBadgeMange = new PrismaCRUDManager(prisma.userBadge, "user_badge_id", false);
const RewardRulePointManage = new PrismaCRUDManager(prisma.rewardPointRule, "reward_point_rule_id", false);
export const GetAllBadge = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
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
export const GetBadgeById = (data) => {
    return BadgeManage.readById(data, "badge_id");
};
export const CreateBadge = async () => {
    return Promise.all(badge.map(({ name, description, requirement_type, requirement_value }) => BadgeManage.create({
        name,
        description,
        requirement_type,
        requirement_value,
        slug: useSlugify(name),
        icon_url: "",
        is_active: true,
    })));
};
export const UpdateBadge = (id, data) => {
    return BadgeManage.update("badge_id", id, data);
};
export const SoftDeleteBadge = (data) => {
    return BadgeManage.delete("badge_id", data);
};
export const GetAllRewardLevel = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
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
export const GetRewardLevelById = (data) => {
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
export const CreateRewardLevel = () => {
    return Promise.all(Reward.map(({ name, description, min_points }, index) => {
        RewardLevelManage.create({
            name,
            min_points,
            description,
            order_index: index,
        });
    }));
};
export const GetAllRewardRules = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
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
export const CreateRewardRules = () => {
    return Promise.all(Rule.map(({ action_type, is_active, points }) => {
        RewardRulePointManage.create({
            action_type,
            is_active,
            points,
        });
    }));
};
