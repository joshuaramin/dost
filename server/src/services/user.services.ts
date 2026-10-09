import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { UserInterface } from "@/lib/interface/user.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import { User } from "@/lib/prisma/system/generated/prisma/client";
import { UserWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { AppError } from "@/lib/common/appError";

const UserManage = new PrismaCRUDManager<User, "user_id", typeof prisma.user>(
  prisma.user,
  "user_id",
);

export const GetAllUsers = ({
  limit,
  after,
  before,
  filter: { orderBy, search, sortBy },
  organization_id,
  role_id,
}: UserInterface) => {
  let where: UserWhereInput = {
    is_deleted: false,
    ...(organization_id && {
      organization_id,
    }),
    ...(role_id && {
      role_id,
    }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: "insensitive" } },
        {
          Profile: {
            OR: [
              { first_name: { contains: search, mode: "insensitive" } },
              { last_name: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ],
    }),
  };
  return UserManage.read({
    where,
    limit,
    ...(after && {
      cursor: after,
      direction: "forward",
    }),
    ...(before && {
      cursor: after,
      direction: "backward",
    }),
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      user_id: true,
      email: true,
      is_active: true,
      is_deleted: true,
      Profile: {
        select: {
          first_name: true,
          last_name: true,
          location: true,
          image_url: true,
        },
      },
      user_preference: {
        select: {
          created_at: true,
          email_activity_notifications: true,
        },
      },
      userBadges: {
        select: {
          badge_id: true,
          badge: true,
        },
      },
      userReward: {
        select: {
          user_reward_id: true,
          level: true,
          total_points: true,
        },
      },
      role: { select: { name: true } },
      organization: { select: { name: true } },
      created_at: true,
    },
  });
};

export const GetUserById = async (data: any) => {
  return UserManage.readById(data, "user_id", {
    select: {
      email: true,
      role: true,
      organization: true,
      is_active: true,
      Profile: {
        select: {
          first_name: true,
          last_name: true,
          location: true,
          image_url: true,
          created_at: true,
        },
      },
      userBadges: {
        select: {
          badge_id: true,
          badge: true,
        },
      },
      userReward: {
        select: {
          user_reward_id: true,
          level: true,
          total_points: true,
        },
      },
      ActivityLog: true,
      DeviceSession: true,
      user_preference: {
        select: {
          created_at: true,
          email_activity_notifications: true,
        },
      },
    },
  });
};

export const CreateUser = async (data: any) => {
  const existingUser = await UserManage.readById(data.email, "email");

  if (existingUser) throw new AppError("Email address is already exist", 409);

  const user = UserManage.create(
    {
      email: data.email,
      Profile: {
        create: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      },
      role: {
        connect: { role_id: data.role_id },
      },
      organization: {
        connect: { organization_id: data.organization_id },
      },
      userReward: {
        create: {
          total_points: 0,
          current_level_id: "cmuz4i4u90000i6y409gpft64",
        },
      },
    },
    {
      userReward: {
        select: {
          user_id: true,
          user: true,
          level: {
            select: {
              reward_level_id: true,
              name: true,
              min_points: true,
            },
          },
          total_points: true,
          current_level_id: true,
        },
      },
    },
  );

  return user;
};

export const UpdateUserLanguage = (id: string, data: any) => {
  return UserManage.update("user_id", id, {
    ...(data.language && {
      Profile: {
        update: { language: data.language },
      },
    }),
  });
};

export const UpdateUserAvatar = (id: string, data: any) => {
  return UserManage.update("user_id", id, {
    ...(data.image_url && {
      Profile: {
        update: { image_url: data.image_url },
      },
    }),
  });
};

export const UpdateUser = (id: string, data: any) => {
  return UserManage.update("user_id", id, {
    ...(data.email && {
      email: data.email,
    }),
    ...(data.first_name ||
      (data.last_name && {
        Profile: {
          update: { last_name: data.last_name, first_name: data.first_name },
        },
      })),
    ...(data.location && {
      Profile: {
        update: { location: data.location },
      },
    }),
  });
};

export const SoftDeleteUser = async (data: any) => {
  console.log(data);
  return UserManage.delete("user_id", data);
};
