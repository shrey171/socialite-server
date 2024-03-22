"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Provide username"],
        trim: true,
        min: 4,
        max: 30,
    },
    alias: {
        type: String,
        required: [true, "Provide alias"],
        trim: true,
        min: 4,
        max: 30,
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        trim: true,
        min: 4,
        max: 30,
    },
    password: {
        type: String,
        required: [true, "Provide password"],
        min: 6,
        max: 20,
    },
    profilePicture: String,
    refreshToken: {
        type: [String],
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    verificationToken: String,
    resetToken: String,
    savedPosts: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Post'
    },
    likedPosts: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Post'
    },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', schema);
