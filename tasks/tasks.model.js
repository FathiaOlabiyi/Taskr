const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null
    },

    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      minLength: 10,
      maxLength: 200,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "on-hold", "review", "completed"],
      default: "todo",
    },

    blocker: {
      type: String,
      enum: [
        "resource-unavailable",
        "technical-issue",
        "requirement-unclear",
        "dependency",
      ],
      default: null,
    },

    expectedResumeDate: {
      type: Date,
      default: null,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },

    deletedAt: {
      type: Date,
      default: null
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", Schema);
