"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const models_1 = require("models");
const CustomResponse_1 = require("utils/CustomResponse");
const tokens_1 = require("utils/tokens");
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh } = req.cookies;
    const { decoded, errors: tokenErrors } = (0, tokens_1.tokenVerification)(refresh, 'refresh');
    if (!decoded) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, errors: tokenErrors, message: "Invalid Token! Login again" });
    }
    const user = yield models_1.User.findById(decoded.userId).exec();
    if (!user || !user.refreshToken.includes(refresh)) {
        // the token was stolen
        res.clearCookie('refresh');
        return (0, CustomResponse_1.errorResponse)(res, { status: 404, message: "Token not found! Login again" });
    }
    const payload = { userId: user._id };
    const tokens = (0, tokens_1.tokenGenerator)({ payload });
    const updatedRefresh = user.refreshToken.filter(token => token !== refresh);
    updatedRefresh.push(tokens.refreshToken);
    user.refreshToken = updatedRefresh;
    yield user.save();
    return (0, CustomResponse_1.authSuccessResponse)(res, { message: "token refreshed successfully", user, tokens });
});
exports.refresh = refresh;
