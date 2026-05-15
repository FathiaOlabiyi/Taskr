const mongoose = require("mongoose");


const Schema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            require: true,
            unique: true
        },

        description: {
            type: String,
            minLength: 10,
            maxLength: 200
        },

        status: {
            type: String,
            enum: ["planning", "active", "on_hold", "completed"],
            default: "planning"
        },

        blocker: {
            type: String,
            enum: ["resource-unavailable", "technical-issue", "requirement-unclear", "external-approval", "dependency"],
            default: null
        },

        expectedResumeDate: {
            type: Date,
            default: null
        },

        dueDate: {
            type: Date,
            default: null
        },
        startedAt: {
            type: Date,
            default: null
        },
        deletedAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        }
}, {
    timestamps: true
});

module.exports = mongoose.model("Project", Schema);