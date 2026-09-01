import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { UserInterface } from "@/lib/interface/user.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import { Prisma, User } from "@/lib/prisma/system/generated/prisma/client";
import { UserWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { AppError } from "@/lib/common/appError";
import { userQueue } from "@/jobs/user/user.queue";

const UserManage = new PrismaCRUDManager<User, "user_id", typeof prisma.user>(
  prisma.user,
  "user_id",
);

export const GetAllUsers = ({
  limit,
  after,
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
        select: { first_name: true, last_name: true },
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
      Profile: true,
      ActivityLog: true,
      DeviceSession: true,
    },
  });
};

export const CreateUser = async (data: any) => {
  const existingUser = await UserManage.readById(data.email, "email");

  if (existingUser) throw new AppError("Email address is already exist", 409);

  const user = UserManage.create({
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
  });

  await userQueue.add(
    "send-welcome-email",
    {
      email: data.email,
      fullname: `${data.first_name} ${data.last_name}`,
    },
    {
      attempts: 3,
      removeOnComplete: true,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    },
  );

  return user;
};

export const SoftDeleteUser = async (data: any) => {
  return UserManage.delete(data.user_id);
};
