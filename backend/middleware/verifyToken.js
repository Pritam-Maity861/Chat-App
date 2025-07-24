import { secretKey } from "../index.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const IsAuthenticated = asyncHandler((req, res, next) => {
    const token = req.cookies?.accessToken; 

    if (!token) {
        return next(new ApiError(401, "Unauthorized. No token provided."));
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("JWT Error:", err);
            return next(new ApiError(403, "Token not valid."));
        }

        console.log("decoded Token:",decoded);
        req.userId = decoded.userId;
        next();
    });
});
