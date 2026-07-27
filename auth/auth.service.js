const Model = require("./auth.model");
const jwt = require("jsonwebtoken");
const utils = require("./auth.utils");
const bcrypt = require("bcrypt");
require("dotenv").config();

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};

const signUp = async({firstname, lastname, username, email, password, profilePicture}) => {
    const existingUser = await Model.findOne({email});
    if(existingUser && existingUser.isDeleted === true) {
      throw new Error("User account exists but deleted, retrive to continue")
    };

    if(existingUser) {
        throw new Error(`User with email ${email} already exists`);
    };

    const createUser = await Model.create({firstname, lastname, username, email, password, profilePicture, authProvider: "manual"});
    await utils.verifyEmail(createUser);
    const jwtToken = generateToken(createUser._id);
    return {createUser, jwtToken};
};

const verifyUserEmail = async(email, token) => {
  const user = await Model.findOne({email: email, isDeleted: false});

  if (!user || user.isDeleted === true) {
    throw new Error("User not found");
  }

  if (user.isVerified === true) {
    throw new Error("User already verified");
  }

  if (
    !user.verificationTokenExpiredAt ||
    Date.now() > user.verificationTokenExpiredAt
  ) {
    throw new Error("Verification Link expired. Request a new link");
  }

  if (!user.verificationToken) {
    throw new Error("Invalid Verification Token");
  }

  const match = await bcrypt.compare(token, user.verificationToken || "");
  if (!match) {
    throw new Error("Invalid verification Token");
  }

  if (match) {
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiredAt = undefined;
    await user.save();
  }
};

const resendEmailVerificationLink = async({email}) => {
  const user = await Model.findOne({email: email, isDeleted: false});

  if (!user || user.isDeleted === true) {
    throw new Error("User not found");
  }

  if (user.isVerified === true) {
    throw new Error("User already verified");
  }

  await utils.verifyEmail(user);
};

const signIn = async({email, password}) => {
    const user = await Model.findOne({email: email, isDeleted: false});

    if(!user || user.isDeleted === true) {
        throw new Error("User not found");
    };

    if(!user.password || user.authProvider === "google") {
        throw new Error("This account was created with Google. Please signIn with Google")
    };

    if(user.isVerified === false) {
        throw new Error("User not verified, verify user before login")
    };

    const comparePasswords = await user.comparePassword(password);
    if(!comparePasswords) {
        throw new Error("Invalid Password")
    };
    user.lastLogin = Date.now();
    user.save();
    const token = generateToken(user._id);

    return {user, token}
};

const forgotPassword = async({email}) => {
  const user = await Model.findOne({email: email, isDeleted: false});

  if(!user || user.isDeleted === true) {
    throw new Error("User not found")
  };

  if (!user.password || user.authProvider === "google") {
    throw new Error(
      "This account was created with Google.",
    );
  }

  if (user.isVerified === false) {
    throw new Error("User not verified, verify user to continue");
  }

  utils.sendPasswordResetToken(user);
};

const resetPassword = async({email, token}, {newPassword}) => {
  const user = await Model.findOne({email: email, isDeleted: false});

  if (!user || user.isDeleted === true) {
    throw new Error("User not found");
  }
  
  if (!user.password || user.authProvider === "google") {
    throw new Error("This account was created with Google.");
  }

  if (!user.passwordResetToken) {
    throw new Error("Invalid Token");
  }
  
  if (
    !user.passwordResetTokenExpiredAt ||
    Date.now() > user.passwordResetTokenExpiredAt
  ) {
    throw new Error("Token expired");
  };
  const compareToken = await bcrypt.compare(
    token,
    user.passwordResetToken || "",
  );

  if (!compareToken) {
    throw new Error("Invalid Token");
  }
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiredAt = undefined;

  user.password = newPassword;
  await user.save();
  return resetPassword;
};

const deleteAccount = async(userId) => {
    const user = await Model.findById(userId);

    if(!user) {
        throw new Error("User not found")
    };

    if(user.isDeleted === true && user.deletedAt !== null) {
        throw new Error("User has already been deleted")
    };

    user.isDeleted = true;
    user.deletedAt = Date.now();
    await user.save();

    return user;
};

module.exports = {
    signUp,
    verifyUserEmail,
    resendEmailVerificationLink,
    signIn,
    forgotPassword,
    resetPassword,
    deleteAccount,
};



