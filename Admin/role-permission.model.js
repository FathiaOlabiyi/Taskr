const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles",
        required: true
        },

    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permissions",
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
Schema.index({ role: 1, permission: 1 }, { unique: true });

module.exports = mongoose.model("Role-permission", Schema);