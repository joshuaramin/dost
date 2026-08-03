import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { geodb } from "@/lib/prisma/geospatial/prisma";
import {
  Prisma,
  treatment_hubs,
} from "@/lib/prisma/geospatial/generated/prisma/client";
import { treatment_hubsWhereInput } from "@/lib/prisma/geospatial/generated/prisma/models";
import { AppError } from "@/lib/common/appError";
import { TreatmentHubInterface } from "@/lib/interface/treatment-hub.interface";

const TreatmentHubManage = new PrismaCRUDManager<
  treatment_hubs,
  "treatment_hub_id",
  typeof geodb.treatment_hubs
>(geodb.treatment_hubs, "treatment_hub_id");

export const GetAllTreatmentHub = async ({
  limit,
  after,
  before,
  filter: { orderBy, search, sortBy },
}: TreatmentHubInterface) => {
  let where: treatment_hubsWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  return TreatmentHubManage.read({
    where,
    limit,
    ...(after && {
      cursor: after,
    }),
    ...(before && {
      cursor: before,
    }),
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      treatment_hub_id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const GetTreatmentHubBySlug = async (data: string) => {
  return TreatmentHubManage.readById(data, "slug", {
    select: {
      treatment_hub_id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const CreateTreatmentHub = async (data: any) => {
  return TreatmentHubManage.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    address: data.address,
    region_id: data.region_id,
    status: data.status,
    barangay_ogc_fid: data.barangay_ogc_fid,
    barangays: {
      connect: {
        ogc_fid: data.barangay_ogc_fid,
      },
    },
    code: data.code,
    contact_number: data.contact_number,
    email: data.email,
    municipalities: {
      connect: {
        ogc_fid: data.municipality_ogc_fid,
      },
    },
  });
};

export const UpdateTreatmentHubById = async (id: string, data: any) => {
  return TreatmentHubManage.update("slug", data, {});
};
