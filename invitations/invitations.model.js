const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    inviteeEmail: {
        type: String,
        required: true
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    status: {
        type: String,
        enum: ["draft", "scheduled", "pending", "expired", "accepted", "rejected", "revoked"],
        default: "draft"
    },

    token: {
        type: String,
        default: null
    },

    scheduleSend: {
        type: Date
    },

    expiresAt: {
        type: Date,
        default: null
    },

    sentAt: {
        type: Date
    },

    respondedAt: {
        type: Date
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Invitation", Schema)