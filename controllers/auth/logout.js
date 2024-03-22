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
exports.logout = void 0;
const models_1 = require("models");
const CustomResponse_1 = require("utils/CustomResponse");
const tokens_1 = require("utils/tokens");
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh } = req.cookies;
    const { decoded, errors: tokenErrors } = (0, tokens_1.tokenVerification)(refresh, 'refresh');
    if (!decoded) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, errors: tokenErrors, message: "Invalid Token!" });
    }
    const verifiedUser = yield models_1.User.findOne({ refreshToken: refresh }).exec();
    if (!verifiedUser) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 404, message: "Token not found! Login required to log-out" });
    }
    const updatedRefresh = verifiedUser.refreshToken.filter(token => token !== refresh);
    verifiedUser.refreshToken = updatedRefresh;
    yield verifiedUser.save();
    res.clearCookie('refresh');
    return (0, CustomResponse_1.successResponse)(res, { message: "logged out Successfully" });
});
exports.logout = logout;
