const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("../utils/nodemailer");
require("dotenv").config();

const logger = require("../logger/winston");

const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const verifyEmail = async(user) => {
  const token = generateToken();
  const hashToken = await bcrypt.hash(token, 10);

  user.verificationToken = hashToken;
  user.verificationTokenExpiredAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  const link = `${process.env.APP_URL}/auth/verify-email?email=${encodeURIComponent(user.email)}&token=${token}`;

  nodemailer.transporter.sendMail({
    from: {
      name: "Taskr",
      address: process.env.EMAIL_USER,
    },
    to: user.email,
    subject: "Email verification",
    text: `Click this link to verify your email ${link}\n\n Link expires in 15 minutes.`,
    html: `<p>Click <a href="${link}">here</a> to verify your email. Link expires in 15 minutes.</p>`,
  });

  logger.info("Verification Link sent");
};

const sendPasswordResetToken = async(user) => {
  const token = generateToken();
  const hashToken = await bcrypt.hash(token, 10);

  user.passwordResetToken = hashToken;
  user.passwordResetTokenExpiredAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.APP_URL}/auth/reset-password?email=${encodeURIComponent(user.email)}&token=${token}`;

    nodemailer.transporter.sendMail({
      from: {
        name: "Taskr",
        address: process.env.EMAIL_USER,
      },
      to: user.email,
      subject: "Password Reset",
      text: `Click this to reset password ${resetLink}\n\n Link expires in 15 minutes.`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset password. Link expires in 15 minutes.</p>`,
    });

    logger.info("Password reset link sent");
};

module.exports =  {
    verifyEmail,
    sendPasswordResetToken
}


