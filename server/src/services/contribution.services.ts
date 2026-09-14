import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { ContributionInterface } from "@/lib/interface/contribution.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  Prisma,
  Contribution,
} from "@/lib/prisma/system/generated/prisma/client";
import useSlugify from "@/lib/helpers/useSlugify";

const ContributionManage = new PrismaCRUDManager<
  Contribution,
  "contribution_id",
  typeof prisma.contribution
>(prisma.contribution, "contribution_id");

export const GetAllContributions = async ({
  after,
  before,
  classification,
  method: classification_method,
  status,
  type,
  limit,
  filter: { orderBy, sortBy, search },
  sentiment,
  user_id,
}: ContributionInterface) => {
  let where = {
    ...(sentiment && {
      sentiment,
    }),
    ...(classification && {
      classification,
    }),
    ...(classification_method && {
      classification_method,
    }),
    ...(status && {
      status,
    }),
    ...(type && {
      type,
    }),
    ...(user_id && {
      user: {
        user_id,
      },
    }),
  } as Prisma.ContributionWhereInput;

  return ContributionManage.read({
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
    select: {
      contribution_id: true,
      type: true,
      content: true,
      slug: true,
      classification: true,
      classification_method: true,
      status: true,
      is_deleted: true,
      image_url: true,
      source_url: true,
      review_reason: true,
      reviewed_by: true,
      reviewed_at: true,
      confidence_score: true,
      barangay: true,
      municipality: true,
      province: true,
      region: true,
      created_at: true,
      sentiment: true,
    },
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};

export const GetContributionById = async (contribution_id: string) => {
  return ContributionManage.readById(contribution_id, "contribution_id", {
    select: {
      contribution_id: true,
      type: true,
      content: true,
      slug: true,
      classification: true,
      classification_method: true,
      status: true,
      is_deleted: true,
      image_url: true,
      source_url: true,
      review_reason: true,
      reviewed_by: true,
      reviewed_at: true,
      confidence_score: true,
      sentiment: true,
    },
  });
};

export const CreateContribution = async (data: any) => {
  return ContributionManage.create({
    content: data.content,
    slug: useSlugify(data.type),
    type: data.type,
    classification: data.classification,
    barangay: data.barangay || "",
    municipality: data.municipality || "",
    province: data.province || "",
    region: data.region || "",
    classification_method: data.classification_method,
    status: data.status,
    image_url: data.image_url,
    source_url: data.source_url,
    confidence_score: data.confidence_score,
    user: {
      connect: {
        user_id: data.user_id,
      },
    },
  });
};

export const UpdateContributeById = async (data: any) => {
  console.log(data);
  return await ContributionManage.update(
    "contribution_id",
    data.contribution_id,
    {
      status: data.status,
      classification: data.status === "APPROVED" ? "FACTUAL" : "MISINFORMATION",
      classification_method: "MANUAL",
      review_reason: data.review_reason,
      reviewed_at: data.review_at,
      sentiment: data.sentiment,
      reviewer: {
        connect: { user_id: data.user_id },
      },
    },
  );
};

export const SoftDeleteContribution = async (contribution_id: string) => {
  return ContributionManage.delete(contribution_id);
};
