import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { OrganizationInterface } from "@/lib/interface/organization.interface";
import { Organization } from "@/lib/prisma/system/generated/prisma/client";
import { OrganizationWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { prisma } from "@/lib/prisma/system/prisma";

// Manage

const OrganizationManage = new PrismaCRUDManager<
  Organization,
  "organization_id",
  typeof prisma.organization
>(prisma.organization, "organization_id");

// Functions

export const GetAllOrganization = ({
  after,
  before,
  filter: { orderBy, search, sortBy },
  limit,
}: OrganizationInterface) => {
  let where: OrganizationWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  return OrganizationManage.read({
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
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};

export const CreateOrganization = (data: any) => {
  return OrganizationManage.create({
    logo: data.logo,
    name: data.name,
    contact: data.contact,
    address: data.address,
  });
};
