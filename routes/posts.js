"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("controllers/posts");
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("middlewares");
const router = express_1.default.Router();
router.get('/', middlewares_1.emailVerifiedCheck, posts_1.getAll);
router.post('/', middlewares_1.emailVerifiedCheck, posts_1.create);
exports.default = router;
