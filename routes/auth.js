"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("controllers/auth");
const middlewares_1 = require("middlewares");
const router = express_1.default.Router();
router.get('/refresh', auth_1.refresh);
router.get('/logout', auth_1.logout);
router.get('/verify/:id/:token', auth_1.verifyUser);
router.post('/forgot-password', (0, middlewares_1.emailValidators)(), middlewares_1.validate, auth_1.forgotPassword);
router.post('/login', (0, middlewares_1.loginValidators)(), middlewares_1.validate, auth_1.login);
router.post('/register', (0, middlewares_1.registerValidators)(), middlewares_1.validate, auth_1.register);
router.patch('/reset-password/:id/:token', (0, middlewares_1.resetPasswordValidators)(), middlewares_1.validate, auth_1.resetPassword);
exports.default = router;
