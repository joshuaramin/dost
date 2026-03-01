import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { UserInterface } from "@/lib/interface/user.interface";
import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@/lib/prisma/generated/prisma/client";

const UserManage = new PrismaCRUDManager<User, "user_id", typeof prisma.user>(
  prisma.user,
  "user_id",
);

export const GetAllUsers = ({
  first,
  after,
  filter: { orderBy, search, sortBy },
}: UserInterface) => {
  return UserManage.read({});
};

export const GetUserById = async (data: any) => {
  return UserManage.readById(data.key, "user_id");
};

export const CreateUser = async (data: any) => {
  return UserManage.create({
    email: data.email,
    password: data.password,
  });
};

export const DeleteUser = async (data: any) => {
  return UserManage.delete(data.user_id);
};
