const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("../utils/nodemailer");
const agenda = require("../config/agenda");
require("dotenv").config();

const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const sendInvitation = async(email, token) => {
    //rewrite this please
    const link = `${process.env.APP_URL}/invitation?email=${encodeURIComponent(email)}&token=${token}`

    nodemailer.transporter.sendMail({
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: "Invitation",
        text: `You have been invited to this project ${link}\n\n`,
        html: `<p>Click <a href="${link}">this</a> to accept or reject invitation</p>`
    });
    console.log("Invitation Link sent");
};

const send = async(invitation) => {
    const token = generateToken();
    const hashToken = await bcrypt.hash(token, 10);
    invitation.token = hashToken;
    invitation.expiresAt = Date.now() + 60 * 60 * 1000 * 24 * 3 //3 days
    invitation.status = "pending";
    const email = invitation.inviteeEmail;
    await invitation.save();

    sendInvitation(email, token);
};

agenda.define("send invitation", async (job) => {
    const invitation = job.attrs.data.invite;
    send(invitation);
});

module.exports = {
    send,
    agenda
};