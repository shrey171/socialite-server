"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerification = exports.tokenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
const tokenGenerator = ({ payload, options }) => {
    let accessTokenExpiry = '1h';
    let refreshTokenExpiry = '30d';
    const accessToken = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, Object.assign(Object.assign({}, options), { expiresIn: accessTokenExpiry }));
    const refreshToken = jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, Object.assign(Object.assign({}, options), { expiresIn: refreshTokenExpiry }));
    return { accessToken, refreshToken };
};
exports.tokenGenerator = tokenGenerator;
const tokenVerification = (token, type) => {
    const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return { decoded, errors: null };
    }
    catch (errors) {
        return { decoded: null, errors };
    }
};
exports.tokenVerification = tokenVerification;
