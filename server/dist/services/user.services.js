"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeleteUser = exports.UpdateUser = exports.UpdateUserAvatar = exports.UpdateUserLanguage = exports.CreateUser = exports.GetUserById = exports.GetAllUsers = void 0;
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const appError_1 = require("../lib/common/appError.js");
const UserManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.user, "user_id");
const GetAllUsers = ({ limit, after, before, filter: { orderBy, search, sortBy }, organization_id, role_id, }) => {
    let where = {
        is_deleted: false,
        ...(organization_id && {
            organization_id,
        }),
        ...(role_id && {
            role_id,
        }),
        ...(search && {
            OR: [
                { email: { contains: search, mode: "insensitive" } },
                {
                    Profile: {
                        OR: [
                            { first_name: { contains: search, mode: "insensitive" } },
                            { last_name: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
            ],
        }),
    };
    return UserManage.read({
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
            user_id: true,
            email: true,
            is_active: true,
            is_deleted: true,
            Profile: {
                select: {
                    first_name: true,
                    last_name: true,
                    location: true,
                    image_url: true,
                    created_at: true,
                    updated_at: true,
                },
            },
            user_preference: {
                select: {
                    created_at: true,
                    email_activity_notifications: true,
                },
            },
            userBadges: {
                select: {
                    badge_id: true,
                    badge: true,
                },
            },
            userReward: {
                select: {
                    user_reward_id: true,
                    level: true,
                    total_points: true,
                },
            },
            role: { select: { name: true } },
            organization: { select: { name: true } },
            created_at: true,
        },
    });
};
exports.GetAllUsers = GetAllUsers;
const GetUserById = async (data) => {
    return UserManage.readById(data, "user_id", {
        select: {
            email: true,
            role: true,
            organization: true,
            is_active: true,
            Profile: {
                select: {
                    first_name: true,
                    last_name: true,
                    location: true,
                    image_url: true,
                    created_at: true,
                },
            },
            userBadges: {
                select: {
                    badge_id: true,
                    badge: true,
                },
            },
            userReward: {
                select: {
                    user_reward_id: true,
                    level: true,
                    total_points: true,
                },
            },
            ActivityLog: {
                select: {
                    activity_logs_id: true,
                    description: true,
                    type: true,
                    is_deleted: true,
                },
            },
            DeviceSession: true,
            user_preference: {
                select: {
                    created_at: true,
                    email_activity_notifications: true,
                },
            },
        },
    });
};
exports.GetUserById = GetUserById;
const CreateUser = async (data) => {
    const existingUser = await UserManage.readById(data.email, "email");
    if (existingUser)
        throw new appError_1.AppError("Email address is already exist", 409);
    const user = UserManage.create({
        email: data.email,
        Profile: {
            create: {
                first_name: data.first_name,
                last_name: data.last_name,
                location: data.location,
            },
        },
        role: {
            connect: { role_id: data.role_id },
        },
        organization: {
            connect: { organization_id: data.organization_id },
        },
        userReward: {
            create: {
                total_points: 0,
                current_level_id: "cmuz4i4u90000i6y409gpft64",
            },
        },
    }, {
        userReward: {
            select: {
                user_id: true,
                user: true,
                level: {
                    select: {
                        reward_level_id: true,
                        name: true,
                        min_points: true,
                    },
                },
                total_points: true,
                current_level_id: true,
            },
        },
    });
    return user;
};
exports.CreateUser = CreateUser;
const UpdateUserLanguage = (id, data) => {
    return UserManage.update("user_id", id, {
        ...(data.language && {
            Profile: {
                update: { language: data.language },
            },
        }),
    });
};
exports.UpdateUserLanguage = UpdateUserLanguage;
const UpdateUserAvatar = async (id, image_url) => {
    if (!id) {
        throw new appError_1.AppError("User ID is required", 400);
    }
    if (!image_url) {
        throw new appError_1.AppError("Image URL is required", 400);
    }
    console.log("[AVATAR SERVICE] Updating user:", id);
    console.log("[AVATAR SERVICE] Image URL:", image_url);
    const updatedUser = await UserManage.update("user_id", id, {
        Profile: {
            update: {
                image_url,
            },
        },
    });
    console.log("[AVATAR SERVICE] Updated user:", updatedUser);
    return updatedUser;
};
exports.UpdateUserAvatar = UpdateUserAvatar;
const UpdateUser = (id, data) => {
    return UserManage.update("user_id", id, {
        ...(data.email && {
            email: data.email,
        }),
        ...(data.first_name ||
            (data.last_name && {
                Profile: {
                    update: { last_name: data.last_name, first_name: data.first_name },
                },
            })),
        ...(data.location && {
            Profile: {
                update: { location: data.location },
            },
        }),
    });
};
exports.UpdateUser = UpdateUser;
const SoftDeleteUser = async (data) => {
    console.log(data);
    return UserManage.delete("user_id", data);
};
exports.SoftDeleteUser = SoftDeleteUser;
