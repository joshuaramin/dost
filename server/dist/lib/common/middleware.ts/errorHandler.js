import { AppError } from "../appError.js";
export const errorHandler = (err, req, res, next) => {
    console.error("🔥 ERROR:", err);
    // AppError (controlled)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // fallback unknown error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
