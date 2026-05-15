const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    googleId: {
        type: String
    },

    authProvider: {
      type: String,
      enum: ["manual", "google"]
    },

    profilePicture: {
      type: String,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    verificationTokenExpiredAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },
    
    passwordResetTokenExpiredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

//hash password before saving to database
Schema.pre("save", async function() {
    if(!this.isModified("password") || !this.password) {
        return
    };
    this.password = await bcrypt.hash(this.password, 10);
});

Schema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
};


module.exports = mongoose.model("User", Schema);

