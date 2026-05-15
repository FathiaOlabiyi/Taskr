const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  },

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  
  deletedAt: {
    type: Date,
  }
}, {
    timestamps: true
});

module.exports = mongoose.model("Member", Schema);

