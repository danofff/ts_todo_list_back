"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    editedAt: {
        type: Date,
        default: new Date(),
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: { virtuals: true },
});
todoSchema.virtual("id").get(function () {
    return this._id;
});
const TodoModel = (0, mongoose_1.model)("Todo", todoSchema);
exports.default = TodoModel;
