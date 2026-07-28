const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("../utils/nodemailer");
const agenda = require("../config/agenda");
require("dotenv").config();
const invitationModel = require("./invitations.model");
const projectModel = require("../projects/projects.model");

const logger = require("../logger/winston");

const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const sendInvitation = async(projectId, email, token) => {
    const link = `${process.env.APP_URL}/project/${projectId}/invitation?token=${token}`;
    const getProjectName = await projectModel.findById(projectId);
    const projectName = getProjectName.title;
    try {
            nodemailer.transporter.sendMail({
              from: {
                name: "Taskr",
                address: process.env.EMAIL_USER,
              },
              to: email,
              subject: "Invitation",
              text: `You have been invited to this project ${link}\n\n`,
              html: `<h3>Hey there!</h3><p>You have been invited to  project <b>${projectName}</b></p><p>Click <a href="${link}">this</a> to accept or reject invitation. Expires in 3 days.</p>`,
            });
    logger.info("Invitation link sent");
    }catch(err) {
        logger.error(err.message);
        throw err;
    };
};

const send = async(invitation) => {
    const token = generateToken();
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    invitation.token = hashToken;
    invitation.expiresAt = Date.now() + 60 * 60 * 1000 * 24 * 3 //3 days
    invitation.status = "pending";
    const projectId = invitation.projectId;
    const email = invitation.inviteeEmail;
    await invitation.save();

    await sendInvitation(projectId, email, token);
};

agenda.define("send invitation", async (job) => {
    const {invitationId} = job.attrs.data;
    const getInvitation = await invitationModel.findById(invitationId);
    await send(getInvitation);
  });

module.exports = {
    send
};