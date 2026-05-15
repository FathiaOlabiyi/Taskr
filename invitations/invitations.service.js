const Model = require("./invitations.model");
const roleModel = require("../Admin/roles.model");
const memberModel = require("../members/members.model");
const {send} = require("./invitations.utils");
const agenda = require("../config/agenda");
const authModel = require("../auth/auth.model");

const createInvitation = async(projectId, email, roleId, scheduleSend, userId) => {
  const existingInvitation = await Model.find({
    projectId,
    inviteeEmail: email});

  if (existingInvitation) {
    throw new Error("Email already exists");
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
  };

  const userMemberId = await memberModel.findOne({ userId })._id;
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
    await agenda.schedule(scheduleDate, "send invitation", createInvite);
    console.log("Invitation has been scheduled");
  };
  return createInvitation;
};

const sendInvitation = async(invitationId) => {
    const findInvitation = await Model.findById(invitationId);

    if(!findInvitation || findInvitation.deletedAt != null) {
      throw new Error("Invitation not found")
    };

    if(findInvitation.status != "draft") {
        throw new Error("Invitation has to be a draft")
    };

    if(findInvitation.scheduleSend) {
        throw new Error("Invitation has already been scheduled")
    };

    send(findInvitation);
};

const validateInvitation = async(token, email) => {
  const getInvitation = await Model.findOne({inviteeEmail: email});

  if(!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found")
  };

  if(getInvitation.status != "pending") {
    throw new Error("Invitation not valid")
  };

  if(!getInvitation.expiresAt || Date.now() > getInvitation.expiresAt) {
    throw new Error("Invitation expired");
    getInvitation.status = "expired";
    await getInvitation.save();
  };

  return getInvitation;
};

const acceptInvitation = async(email, token, userId) => {
  const getInvitation = await Model.findOne({ email });

  if (!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found");
  }

  if (getInvitation.status != "pending") {
    throw new Error("Invitation cannot be accepted");
  }

  if (!getInvitation.expiresAt || Date.now() > getInvitation.expiresAt) {
    throw new Error("Invitation expired");
    getInvitation.status = "expired";
    await getInvitation.save();
  }
  const user = await authModel.findById(userId);

  if(user.email !== invite.email) {
    throw new Error("Not your invite")
  };

  const projectId = getInvitation.projectId;
  const addedBy = getInvitation.invitedBy;
  const role = getInvitation.role;

  const existingMember = await memberModel.find({projectId, userId});

  if(existingMember) {
    throw new Error("Member already exists in project")
  };

  const createMember = await memberModel.create({projectId, userId, addedBy, role});

  getInvitation.status = "accepted";
  getInvitation.respondedAt = Date.now();
  await getInvitation.save();
  return createMember, getInvitation;
};


const rejectInvitation = async(email, token) => {
  const getInvitation = await Model.findOne({ email });

  if (!getInvitation || getInvitation.deletedAt != null) {
    throw new Error("Invitation not found");
  }

  if (getInvitation.status != "pending") {
    throw new Error("Invitation cannot be rejected");
  }

  if (!getInvitation.expiresAt || Date.now() > getInvitation.expiresAt) {
    throw new Error("Invitation expired");
    getInvitation.status = "expired";
    await getInvitation.save();
  };

  const user = await authModel.findById(userId);

  if(user.email !== invite.email) {
    throw new Error("Not your invites")
  };

  getInvitation.status = "rejected";
  getInvitation.respondedAt = Date.now();
  await getInvitation.save();

  return getInvitation;
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
  validateInvitation,
  acceptInvitation,
  rejectInvitation,
  revokeInvitation,
  rescheduleInvitation,
  getInvitations,
  getInvitationById,
  updateInvitation,
  deleteInvitation
};