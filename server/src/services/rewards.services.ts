import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import useSlugify from "@/lib/helpers/useSlugify";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  Prisma,
  RewardLevel,
  UserReward,
  UserBadge,
  RewardPointRule,
  Badge,
} from "@/lib/prisma/system/generated/prisma/client";
import {
  BadgeWhereInput,
  BadgeWhereUniqueInput,
  RewardLevelWhereInput,
  RewardPointRuleWhereInput,
} from "@/lib/prisma/system/generated/prisma/models";
import {
  BadgeInterface,
  RewardLevelInterface,
  RewardPointRuleInterface,
  RewardTransaction,
  UserBadgeInterface,
  UserRewardInterface,
} from "@/lib/interface/rewards.interface";
import { Reward, badge, Rule } from "@/utils/reward_badge.util";

const RewardLevelManage = new PrismaCRUDManager<
  RewardLevel,
  "reward_level_id",
  typeof prisma.rewardLevel
>(prisma.rewardLevel, "reward_level_id", false);

const BadgeManage = new PrismaCRUDManager<
  Badge,
  "badge_id",
  typeof prisma.badge
>(prisma.badge, "badge_id", false);

const UserBadgeMange = new PrismaCRUDManager<
  UserBadge,
  "user_badge_id",
  typeof prisma.userBadge
>(prisma.userBadge, "user_badge_id", false);

const RewardRulePointManage = new PrismaCRUDManager<
  RewardPointRule,
  "reward_point_rule_id",
  typeof prisma.rewardPointRule
>(prisma.rewardPointRule, "reward_point_rule_id");

export const GetAllBadge = ({
  after,
  before,
  filter: { orderBy, search, sortBy },
  limit,
}: BadgeInterface) => {
  let where: BadgeWhereInput = {
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

export const GetBadgeById = (data: string) => {
  return BadgeManage.readById(data, "badge_id");
};

export const CreateBadge = async () => {
  return Promise.all(
    badge.map(({ name, description, requirement_type, requirement_value }) =>
      BadgeManage.create({
        name,
        description,
        requirement_type,
        requirement_value,
        slug: useSlugify(name),
        icon_url: "",
        is_active: true,
      }),
    ),
  );
};

export const UpdateBadge = (id: string, data: any) => {
  return BadgeManage.update("badge_id", id, data);
};
export const SoftDeleteBadge = (data: any) => {
  return BadgeManage.delete("badge_id", data);
};

export const GetAllRewardLevel = ({
  after,
  before,
  filter: { orderBy, search, sortBy },
  limit,
}: RewardLevelInterface) => {
  let where: RewardLevelWhereInput = {
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

export const GetRewardLevelById = (data: any) => {
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
  return Promise.all(
    Reward.map(({ name, description, min_points }, index) => {
      RewardLevelManage.create({
        name,
        min_points,
        description,
        order_index: index,
      });
    }),
  );
};

export const GetAllRewardRules = ({
  after,
  before,
  filter: { orderBy, search, sortBy },
  limit,
}: RewardPointRuleInterface) => {
  let where: RewardPointRuleWhereInput = {
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
  return Promise.all(
    Rule.map(({ action_type, is_active, points }) => {
      RewardRulePointManage.create({
        action_type,
        is_active,
        points,
      });
    }),
  );
};
