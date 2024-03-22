"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator of the post should be mentioned']
    },
    title: {
        type: String,
        trim: true,
        required: [true, "Post title is missing"],
        max: 100,
    },
    imgUrl: {
        type: String,
        trim: true,
        required: [true, "Post image is missing"],
    },
    tags: [{
            type: String,
            trim: true
        }],
    likes: {
        type: Number,
        default: 0
    },
    saves: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)('Post', schema);
