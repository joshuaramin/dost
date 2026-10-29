import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { geodb } from "../lib/prisma/geospatial/prisma.js";
import { services } from "../lib/prisma/geospatial/generated/prisma/client.js";
import { servicesWhereInput } from "../lib/prisma/geospatial/generated/prisma/models.js";
import { TreatmentHubServiceInterace } from "../lib/interface/service.interface.js";

const ServiceManage = new PrismaCRUDManager<
  services,
  "service_id",
  typeof geodb.services
>(geodb.services, "service_id", false);

export const GetAllTreatmentHubService = ({
  after,
  before,
  filter: { orderBy, search, sortBy },
  limit,
}: any) => {
  const where: servicesWhereInput = {
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  return ServiceManage.read({
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
      service_id: true,
      name: true,
    },
  });
};

export const CreateTreatmentHubService = (data: any) => {
  return ServiceManage.create({
    name: data.name,
    description: data.description,
  });
};
