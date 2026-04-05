import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { UserInterface } from "@/lib/interface/user.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import { Prisma, User } from "@/lib/prisma/system/generated/prisma/client";
import { UserWhereInput } from "@/lib/prisma/system/generated/prisma/models";

const UserManage = new PrismaCRUDManager<User, "user_id", typeof prisma.user>(
  prisma.user,
  "user_id",
);

export const GetAllUsers = ({
  limit,
  after,
  filter: { orderBy, search, sortBy },
}: UserInterface) => {
  let where: UserWhereInput = {
    is_deleted: false,
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
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};

export const GetUserById = async (data: any) => {
  return UserManage.readById(data.key, "user_id");
};

export const CreateUser = async (data: any) => {
  return UserManage.create({
    email: data.email,
    Profile: {
      create: {
        first_name: data.first_name,
        last_name: data.last_name,
      },
    },
  });
};

export const SoftDeleteUser = async (data: any) => {
  return UserManage.delete(data.user_id);
};
