"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSuccessResponse = exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (res, { status = 400, message = "Request Failed", errors }) => res.status(status).json({ message, errors });
exports.errorResponse = errorResponse;
const successResponse = (res, { status = 200, message = "Request Successful", data }) => res.status(status).json({ message, data });
exports.successResponse = successResponse;
const authSuccessResponse = (res, { user, tokens, message = 'Authentication Successful' }) => {
    const { username, alias, email } = user;
    const { accessToken, refreshToken } = tokens;
    const responseData = { user: { username, alias, email }, token: accessToken };
    res.cookie('refresh', refreshToken, { httpOnly: true, sameSite: true, secure: true, maxAge: 3600000 * 24 * 7 });
    return (0, exports.successResponse)(res, { message, data: responseData });
};
exports.authSuccessResponse = authSuccessResponse;
