require("dotenv").config();
const Model = require("./invitations.model");
const roleModel = require("../Admin/roles.model");
const memberModel = require("../members/members.model");
const {send} = require("./invitations.utils");
const authModel = require("../auth/auth.model");
const mongoose = require("mongoose");
const crypto = require("crypto");

const createInvitation = async(projectId, {email, roleId, scheduleSend}, userId) => {
  const existingInvitation = await Model.findOne({
    projectId,
    inviteeEmail: email});

    //check if email is not owner's email
    const findOwnerEmail = await authModel.findById(userId);
    const ownerEmail = findOwnerEmail.email;

    if(email == ownerEmail) {
      throw new Error("Email belongs to owner")
    };

    //get caller's role
    const findCallerRoleId = await memberModel.findOne({projectId, userId});
    const callerRoleId = findCallerRoleId.role;
    const callerRole = await roleModel.findById(callerRoleId);
    const callerRoleName = callerRole.name;

  if (existingInvitation) {
    throw new Error("Email already exists");
  };

  const findRole = await roleModel.findById(roleId);
  if (!findRole || findRole.deletedAt !== null) {
    throw new Error("Role not found");
  };

  if (findRole.name === "Owner") {
    throw new Error("Not allowed");
  };

  if (findRole.name === "Project Manager") {
    if(callerRoleName === "Project Manager") {
      throw new Error("Not allowed")
    };

    const projectManager = await memberModel.find({ roleId });
    console.log(projectManager.role);

    if (projectManager.length >= 5) {
      throw new Error("Project Managers cannot be greater than 5");
    };
  };

  const findUserMemberId = await memberModel.findOne({userId});
  const userMemberId = findUserMemberId._id
  const createInvite = await Model.create({
    projectId,
    roleId,
    inviteeEmail: email,
    invitedBy: userMemberId,
    scheduleSend,
  });

  if(scheduleSend) {
    createInvite.status = "scheduled";
    await createInvite.save();
    const scheduleDate = createInvite.scheduleSend;
    await agenda.start();
    await agenda.schedule(scheduleDate, "send invitation", {invite: createInvite});
    console.log("Invitation has been scheduled");
  };
  return createInvite;
};

const sendInvitation = async(invitationId, userId, projectId) => {

  const findMemberId = await memberModel.findOne({projectId, userId});
  const memberId = findMemberId._id;

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      throw new Error("Invalid invitation ID format");
    };

    const findInvitation = await Model.findById(invitationId);

    if(String(findInvitation.invitedBy) !== String(memberId)) {
      throw new Error("Not allowed");
    }

    if(!findInvitation || findInvitation.deletedAt !== null) {
      throw new Error("Invitation not found")
    };

    if(findInvitation.status !== "draft") {
        throw new Error(`Invitation ${findInvitation.status}, cannot send`)
    };

    if(findInvitation.scheduleSend) {
        throw new Error("Invitation has already been scheduled")
    };

    send(findInvitation);
};

const getInvitationByToken = async(token) => {
  const hashedToken = crypto.createHash("sha256").update("token").digest("hex");

  const invitation = await Model.findOne({token: hashedToken, deletedAt: null});

  if(!invitation) {
    throw new Error("Invitation not found");
  };

  if(invitation.status !== "pending") {
    throw new Error("Invitation not valid")
  };

  if(Date.now() > invitation.expiresAt) {
    invitation.status = "expired";
    invitation.token = null;
    await invitation.save();

    throw new Error("Invitation expired");
  };

  return invitation;
};

const getInvitation = async (token) => {
  const invitation = await getInvitationByToken(token);

  return invitation;
};

const acceptInvitation = async (token, userId) => {
  const invitation = await getInvitationByToken(token);

  const user = await authModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email !== invitation.inviteeEmail) {
    throw new Error("This invitation is not yours.");
  }

  const existingMember = await memberModel.findOne({
    projectId: invitation.projectId,
    userId,
  });

  if (existingMember) {
    throw new Error("User is already a member.");
  }

  const member = await memberModel.create({
    projectId: invitation.projectId,

    userId,

    addedBy: invitation.invitedBy,

    role: invitation.roleId,
  });

  invitation.status = "accepted";
  invitation.respondedAt = new Date();
  invitation.token = null;

  await invitation.save();

  return {
    invitation,
    member,
  };
};

const rejectInvitation = async (token, userId) => {
  const invitation = await getInvitationByToken(token);

  const user = await authModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email !== invitation.inviteeEmail) {
    throw new Error("This invitation is not yours.");
  }

  invitation.status = "rejected";
  invitation.respondedAt = new Date();
  invitation.token = null;

  await invitation.save();

  return invitation;
};

const revokeInvitation = async(invitationId) => {
  const getInvitation = await Model.findById(invitationId);

  if (!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found");
  }

  if (getInvitation.status != "pending") {
    throw new Error("Invitation cannot be revoked");
  }

  if (!getInvitation.expiresAt || Date.now() > getInvitation.expiresAt) {
    throw new Error("Invitation expired");
    getInvitation.status = "expired";
    await getInvitation.save();
  }

  getInvitation.status = "revoked";
  getInvitation.token = null;
  await getInvitation.save();

  return getInvitation;
};

const rescheduleInvitation = async(invitationId, scheduleSend) => {
  const getInvitation = await Model.findById(invitationId);

  if (!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found");
  }

  if (getInvitation.status != "scheduled" || getInvitation.status != "draft") {
    throw new Error("Invitation cannot be rescheduled");
  }

  getInvitation.scheduleSend = scheduleSend;
  await getInvitation.save();

  await agenda.start();
  await agenda.schedule(scheduleSend, "send invitation", getInvitation);      
  console.log("Invitation has been scheduled");

  return getInvitation;
};

const resendInvitation = async(invitationId, userId, projectId) => {

    const findMemberId = await memberModel.findOne({ projectId, userId });
    const memberId = findMemberId._id;

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      throw new Error("Invalid invitation ID format");
    };

    const findInvitation = await Model.findById(invitationId);

    if (String(findInvitation.invitedBy) !== String(memberId)) {
      throw new Error("Not allowed");
    };

    if (!findInvitation || findInvitation.deletedAt !== null) {
      throw new Error("Not found");
    };

    if (findInvitation.scheduleSend) {
      throw new Error("Invitation has already been scheduled");
    };

    if(findInvitation.status === "pending" || findInvitation.status === "expired") {
      findInvitation.token = null;
      findInvitation.expiresAt = null;
      send(findInvitation);
      await findInvitation.save();
      return findInvitation;
    }else {
      throw new Error("Invitation cannot be resent");
    };
};

const getInvitations = async(projectId, status) => {
  let query = {};
  if(status) {
    query.status = { $regex: status, $options: "i" };
  };

  const invitations = await Model.find({projectId, query, deletedAt: null});
  return invitations;
};

const getInvitationById = async(invitationId) => {
  const getInvitation = await Model.findById(invitationId);

  if(!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found")
  };
  return getInvitation;
};

const updateInvitation = async(invitationId, roleId, inviteeEmail) => {
  const getInvitation = await Model.findById(invitationId);

  if (!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found");
  }

  if (getInvitation.status != "draft") {
    throw new Error("Invitation cannot be updated");
  }

  const findRole = await roleModel.findById(roleId);
  if (!findRole || findRole.deletedAt != null) {
    throw new Error("Role not found");
  }

  if (findRole.name == "Owner") {
    throw new Error("Not allowed");
  }

  if (findRole.name == "Project Manager") {
    const projectManager = await memberModel.find({ roleId });
    console.log(projectManager);

    if (projectManager.length >= 5) {
      throw new Error("Project Managers cannot be greater than 5");
    }
  }
  getInvitation.roleId = roleId;
  getInvitation.inviteeEmail = inviteeEmail;
  await getInvitation.save();

  return getInvitation;
};

const deleteInvitation = async(invitationId) => {
    const getInvitation = await Model.findById(invitationId);

    if (!getInvitation || getInvitation.deletedAt != null) {
      throw new Error("Invitation not found");
    }

    if (getInvitation.status == "pending" || getInvitation.status == "accepted" || getInvitation.status == "scheduled") {
      throw new Error("Invitation cannot be deleted");
    }

    getInvitation.deletedAt = Date.now();
    await getInvitation.save();
};

module.exports = {
  createInvitation,
  sendInvitation,
  getInvitation,
  acceptInvitation,
  rejectInvitation,
  revokeInvitation,
  rescheduleInvitation,
  resendInvitation,
  getInvitations,
  getInvitationById,
  updateInvitation,
  deleteInvitation
};