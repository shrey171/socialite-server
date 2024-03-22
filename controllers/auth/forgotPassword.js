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
exports.forgotPassword = void 0;
const models_1 = require("models");
const CustomResponse_1 = require("utils/CustomResponse");
const email_1 = require("utils/email");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.matchedData;
    const user = yield models_1.User.findOne({ email }).exec();
    if (!user) {
        const errors = { email: 'Invalid email! user not found' };
        return (0, CustomResponse_1.errorResponse)(res, { status: 404, message: "Password Recovery failed", errors });
    }
    const rawToken = (0, crypto_random_string_1.default)({ length: 50 });
    const hashedToken = yield bcrypt_1.default.hash(rawToken, 7);
    user.resetToken = hashedToken;
    yield user.save();
    const verificationLink = `${process.env.CLIENT_URL}/reset-password/${user._id}/${rawToken}`;
    const subject = 'Socialite - Recover password';
    const text = `Click this link to reset your password: ${verificationLink}`;
    (0, email_1.sendMail)({ to: email, subject, text });
    return (0, CustomResponse_1.successResponse)(res, { message: "Password reset link sent to your email" });
});
exports.forgotPassword = forgotPassword;
