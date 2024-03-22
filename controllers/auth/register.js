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
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("models");
const CustomResponse_1 = require("utils/CustomResponse");
const tokens_1 = require("utils/tokens");
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const email_1 = require("utils/email");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.matchedData;
    const usernameExists = yield models_1.User.findOne({ username: data.username }).exec();
    if (usernameExists) {
        const errors = { username: 'Username already in use' };
        return (0, CustomResponse_1.errorResponse)(res, { status: 409, errors });
    }
    const emailExists = yield models_1.User.findOne({ email: data.email }).exec();
    if (emailExists) {
        const errors = { email: 'Email already in use' };
        return (0, CustomResponse_1.errorResponse)(res, { status: 409, errors });
    }
    const rawVerificationToken = (0, crypto_random_string_1.default)({ length: 50 });
    const verificationToken = yield bcrypt_1.default.hash(rawVerificationToken, 7);
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 7);
    const registerData = Object.assign(Object.assign({}, data), { password: hashedPassword, verificationToken });
    const user = new models_1.User(registerData);
    const payload = { userId: user._id };
    const tokens = (0, tokens_1.tokenGenerator)({ payload });
    user.refreshToken = [tokens.refreshToken];
    yield user.save();
    const verificationLink = `${process.env.BASE_URL}/auth/verify/${user._id}/${rawVerificationToken}`;
    const text = `Use this link to verify your email: ${verificationLink}`;
    console.log('bcrypt.hash ~ verificationLink', verificationLink);
    (0, email_1.sendMail)({ to: user.email, subject: "Socialite - Email verification", text });
    return (0, CustomResponse_1.authSuccessResponse)(res, { message: "registration successful", user, tokens });
});
exports.register = register;
