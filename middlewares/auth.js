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
exports.emailVerifiedCheck = exports.verifyLogin = void 0;
const models_1 = require("models");
const CustomResponse_1 = require("utils/CustomResponse");
const tokens_1 = require("utils/tokens");
const verifyLogin = (publicRoutes) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isPublic = publicRoutes.find(route => req.path.startsWith(`/${route}`));
    if (isPublic)
        return next();
    const authHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!authHeader)
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: "must be authorized to access resource" });
    const token = authHeader.replace('Bearer ', '');
    const { decoded, errors } = (0, tokens_1.tokenVerification)(token, 'access');
    if (errors)
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: "Login Again!", errors });
    req.userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
    return next();
});
exports.verifyLogin = verifyLogin;
const emailVerifiedCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield models_1.User.findById(userId).exec();
    if (!(user === null || user === void 0 ? void 0 : user.isVerified))
        return (0, CustomResponse_1.errorResponse)(res, { status: 401, message: 'Verify your email' });
    return next();
});
exports.emailVerifiedCheck = emailVerifiedCheck;
