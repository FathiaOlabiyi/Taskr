const Model = require("./members.model");
const taskModel = require("../tasks/tasks.model");
const roleModel = require("../Admin/roles.model");
const mongoose = require("mongoose");

const getMembers = async(projectId, role) => {
    let query = {
      projectId,
      deletedAt: null
    };

    if(role) {
        const formatRole = {$regex: `^${role}$`, $options: "i"};

        const findRole = await roleModel.findOne({
          name: formatRole,
          deletedAt: null,
        });

        if(!findRole) {
          throw new Error("Role does not exist")
        };
        const getRole = findRole._id;
        query.role = getRole
    };

  const members = await Model.find(query);
  return members;
};

const getMemberById = async(memberId) => {

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      throw new Error("Invalid member ID format");
    };

    const getMember = await Model.findById(memberId);

    if(!getMember || getMember.deletedAt !== null) {
        throw new Error("Member not found")
    };

    return getMember;
};

const removeMember = async(userId, memberId, projectId) => {

  const getProjectStatus = await projectModel.findById(projectId);

  if (
    getProjectStatus.status === "completed" ||
    getProjectStatus.status === "on_hold"
  ) {
      throw new Error(
        `Cannot continue, project ${getProjectStatus.status}`,
      );
  };

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID format");
  }
  
  const getCallerRole = await Model.findOne({
    projectId,
    userId,
    deletedAt: null,
  });
  const getCallerRoleId = getCallerRole.role;

  const getCallerRoleName = await roleModel.findById(getCallerRoleId);
  if (!getCallerRoleName || getCallerRoleName.deletedAt !== null) {
    throw new Error("Role not found");
  }
  const callerRoleName = getCallerRoleName.name;

  //get called role
  const getMember = await Model.findById(memberId);
  if (!getMember || getMember.deletedAt !== null) {
    throw new Error("Member not found");
  }
  const memberRole = getMember.role;
  const getRoleName = await roleModel.findById(memberRole);
  if (!getRoleName || getRoleName.deletedAt !== null) {
    throw new Errpr("Role not found");
  }
  const roleName = getRoleName.name;

  if (roleName === "Owner") {
    throw new Error("Forbidden");
  }

  if (callerRoleName === "Project Manager" && roleName === "Project Manager") {
    throw new Error("Not allowed");
  }

  getMember.deletedAt = Date.now();
  await getMember.save();
};

const leaveProject = async(userId, projectId) => {

    const getProjectStatus = await projectModel.findById(projectId);
  
    if (
      getProjectStatus.status === "completed"
    ) {
        throw new Error(
          `cannot continue, project ${getProjectStatus.status}`,
        );
    };

  const getMembership = await Model.findOne({projectId, userId});

  if (getMembership.deletedAt !== null) {
    throw new Error("Member not found");
  }

  const getMemberRole = getMembership.role;

  const getRoleName = await roleModel.findById(getMemberRole);

  if (!getRoleName || getRoleName.deletedAt !== null) {
    throw new Error("Role not found");
  }

  const roleName = getRoleName.name;

  if (roleName === "Owner") {
    throw new Error("Owner cannot leave project");
  }

  getMembership.deletedAt = Date.now();
  await getMembership.save();
};

module.exports = {
    getMembers,
    getMemberById,
    removeMember,
    leaveProject
};

