import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { geodb } from "@/lib/prisma/geospatial/prisma";
import {
  Prisma,
  treatment_hubs,
} from "@/lib/prisma/geospatial/generated/prisma/client";
import { treatment_hubsWhereInput } from "@/lib/prisma/geospatial/generated/prisma/models";
import { AppError } from "@/lib/common/appError";
import { TreatmentHubInterface } from "@/lib/interface/treatment-hub.interface";
import useSlugify from "@/lib/helpers/useSlugify";

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
  psgc_code,
}: TreatmentHubInterface) => {
  let where: treatment_hubsWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
    ...(psgc_code && {
      regions: { psgc_code: { contains: psgc_code, mode: "insensitive" } },
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
      address: true,
      barangays: true,
      provinces: true,
      code: true,
      email: true,
      latitude: true,
      longitude: true,
      contact_number: true,
      municipalities: true,
      regions: true,
      services: true,
      website: true,
      operating_hours: true,
      region_id: true,
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
    slug: useSlugify(data.name),
    description: data.description,
    address: data.address,
    region_id: data.region_id,
    status: data.status,

    code: data.code,
    contact_number: data.contact_number,
    email: data.email,

    latitude: data.latitude,
    longitude: data.longitude,

    ...(data.region_ogc_fid
      ? {
          regions: {
            connect: { region_id: data.region_ogc_fid },
          },
        }
      : {}),

    ...(data.barangay_ogc_fid
      ? {
          barangays: {
            connect: {
              ogc_fid: data.barangay_ogc_fid,
            },
          },
        }
      : {}),

    ...(data.municipality_ogc_fid
      ? {
          municipalities: {
            connect: {
              ogc_fid: data.municipality_ogc_fid,
            },
          },
        }
      : {}),

    ...(data.province_ogc_fid
      ? {
          provinces: {
            connect: {
              ogc_fid: data.province_ogc_fid,
            },
          },
        }
      : {}),
  });
};

export const UpdateTreatmentHubById = async (id: string, data: any) => {
  return TreatmentHubManage.update("slug", data, {});
};
