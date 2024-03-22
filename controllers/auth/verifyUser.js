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
exports.verifyUser = void 0;
const models_1 = require("models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const CustomResponse_1 = require("utils/CustomResponse");
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const user = yield models_1.User.findById(id).exec();
    if (!user || !user.verificationToken) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: "Invalid user/token" });
    }
    const validToken = yield bcrypt_1.default.compare(token, user.verificationToken);
    if (!validToken) {
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: "Invalid verification link!" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.save();
    return (0, CustomResponse_1.successResponse)(res, { message: "Verification Successful" });
});
exports.verifyUser = verifyUser;
