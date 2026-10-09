import {
  CreateBadge,
  CreateRewardLevel,
  CreateRewardRules,
  GetAllBadge,
  GetAllRewardLevel,
  GetAllRewardRules,
  GetBadgeById,
  GetRewardLevelById,
} from "@/services/rewards.services";

import { Request, Response } from "express";

export const getAllBadge = async (request: Request, response: Response) => {
  const { after, orderBy, search, sortBy, limit, before } = request.query;

  const result = await GetAllBadge({
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getBadgeId = async (request: Request, response: Response) => {
  const id = String(request.params.id);

  const result = await GetBadgeById(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createBadge = async (request: Request, response: Response) => {
  const result = await CreateBadge();

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getAllRewardLevel = async (
  request: Request,
  response: Response,
) => {
  const { after, orderBy, search, sortBy, limit, before } = request.query;

  const result = await GetAllRewardLevel({
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getRewardLevelById = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);

  const result = await GetRewardLevelById(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

/// Reward Level

export const createReward = async (request: Request, response: Response) => {
  const result = await CreateRewardLevel();

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

//RuleReward

export const getAllRewardPointRule = async (
  request: Request,
  response: Response,
) => {
  const { after, orderBy, search, sortBy, limit, before } = request.query;

  const result = await GetAllRewardRules({
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createRuleReward = async (
  request: Request,
  response: Response,
) => {
  const result = await CreateRewardRules();

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
