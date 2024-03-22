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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("models");
const CustomResponse_1 = require("utils/CustomResponse");
const tokens_1 = require("utils/tokens");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const oldRefresh = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.refresh;
    const { username, password } = req.matchedData;
    const user = yield models_1.User.findOne({ username }).exec();
    if (!user) {
        const errors = { username: 'User not found' };
        return (0, CustomResponse_1.errorResponse)(res, { status: 404, message: 'Login Failed', errors });
    }
    const validUser = yield bcrypt_1.default.compare(password, user.password);
    if (!validUser) {
        const errors = { password: "Wrong password" };
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: 'Login Failed', errors });
    }
    const payload = { userId: user._id };
    const tokens = (0, tokens_1.tokenGenerator)({ payload });
    if (oldRefresh) {
        user.refreshToken = user.refreshToken.filter(token => token !== oldRefresh);
    }
    user.refreshToken.push(tokens.refreshToken);
    console.log('constlogin:IRouteHandler= ~ user.refreshToken', user.refreshToken);
    yield user.save();
    return (0, CustomResponse_1.authSuccessResponse)(res, { message: 'login successful', user, tokens });
});
exports.login = login;
