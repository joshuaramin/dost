import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { OrganizationInterface } from "@/lib/interface/organization.interface";
import { Organization } from "@/lib/prisma/system/generated/prisma/client";
import { OrganizationWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { prisma } from "@/lib/prisma/system/prisma";

const OrganizationManage = new PrismaCRUDManager<
  Organization,
  "organization_id",
  typeof prisma.organization
>(prisma.organization, "organization_id");

export const GetAllOrganization = ({
  after,
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
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};
