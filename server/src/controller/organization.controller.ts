import { Request, Response } from "express";
import {
  CreateOrganization,
  GetAllOrganization,
} from "@/services/organization.services";
import { OrganizationSchema } from "@/lib/validation/organization.validation";

export const getAllOrganization = async (
  request: Request,
  response: Response,
) => {
  const { sortBy, orderBy, limit, search, after, before } = request.query;

  const result = await GetAllOrganization({
    limit: limit as string,
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
export const createOrganization = async (
  request: Request,
  response: Response,
) => {
  try {
    const parseData = OrganizationSchema.safeParse(request.body);

    if (!parseData.success) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: parseData.error.flatten().fieldErrors,
        timestamp: new Date(),
      });
    }

    const file = request.file as Express.MulterS3.File;

    console.log(file);

    if (!file) {
      return response.status(400).json({
        message: "No logo file uploaded",
      });
    }

    if (!file.mimetype.startsWith("image/")) {
      return response.status(400).json({
        message: "Only image files are allowed",
      });
    }
    const result = await CreateOrganization({
      logo: `${process.env.CDN_URL}/${file.key}`,
      name: parseData.data.name,
      address: parseData.data.address,
      contact: parseData.data.contact,
    });

    return response.status(200).json({
      ...result,
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Something went wrong",
      timestamp: new Date(),
    });
  }
};

export const softDeleteOrganization = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);
  // const result =
};
