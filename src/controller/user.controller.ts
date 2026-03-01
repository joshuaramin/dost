import { GetAllUsers, GetUserById } from "@/services/user.services";
import { Request, Response } from "express";

export const getAllUsers = async (request: Request, response: Response) => {
  try {
    const { after, orderBy, search, sortBy, first } = request.query;
    const result = await GetAllUsers({
      after: after as string,
      filter: {
        orderBy: orderBy as string,
        search: search as string,
        sortBy: sortBy as string,
      },
      first: parseInt(first as string),
    });

    return response
      .json({
        success: true,
        data: result,
      })
      .status(200);
  } catch (error) {
    return response.json({ message: "Internal Server Error" });
  }
};

export const getUersById = async (request: Request, response: Response) => {
  try {
    const id = String(request.params.id);
    const result = await GetUserById(id);

    return response
      .json({
        success: true,
        data: result,
      })
      .status(200);
  } catch (error) {
    return response.json({ message: "Internal Server Error" }).status(500);
  }
};
