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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const models_1 = require("models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const CustomResponse_1 = require("utils/CustomResponse");
const tokens_1 = require("utils/tokens");
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const { password } = req.matchedData;
    const user = yield models_1.User.findById(id).exec();
    if (!user || !user.resetToken) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: "invalid reset link" });
    }
    const validToken = yield bcrypt_1.default.compare(token, user.resetToken);
    if (!validToken) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: "invalid verification link!" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 7);
    const payload = { userId: user._id };
    const tokens = (0, tokens_1.tokenGenerator)({ payload });
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.refreshToken = [tokens.refreshToken];
    yield user.save();
    return (0, CustomResponse_1.authSuccessResponse)(res, { message: "password changed successfully", user, tokens });
});
exports.resetPassword = resetPassword;
