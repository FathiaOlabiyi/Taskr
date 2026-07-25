const Model = require("./members.model");
const taskModel = require("../tasks/tasks.model");
const roelModel = require("../Admin/roles.model");

const getMembers = async(projectId, role) => {
    let query = {}

    if(role) {
        query.role = { $regex: status, $options: "i" };
    }
  const members = await Model.find({projectId, query, deletedAt: null});
  return members;
};

const getMemberById = async(memberId) => {
    const getMember = await Model.findById(memberId);

    if(!getMember || getMember.deletedAt != null) {
        throw new Error("Member not found")
    };

    return getMember;
};

const removeMember = async(userId, memberId, projectId) => {
  //get caller's role
  const getCallerRoleId = await Model.find({projectId, userId}).role;
  const getCallerRoleName = await roleModel.findById(getCallerRoleId).name;

  const getMemberRole = await Model.findById(memberId).role;
  const getRoleName = await roleModel.findById(getMemberRole).name;

  if (!getMember || getMember.deletedAt != null) {
    throw new Error("Member not found");
  };

  if(roleName == "Owner") {
    throw new Error("Forbidden")
  };

  if(getCallerRoleName == "Project Manager" && roleName == "Project Manager") {
    throw new Error("Not allowed")
  };

  getMember.deletedAt = Date.now();
  await getMember.save();
};

const leaveProject = async(userId, projectId) => {
  const getMembership = await Model.find({projectId, userId});

  if(getMembership.deletedAt != null) {
    throw new Error("Member not found")
  };

  getMembership.deletedAt = Date.now();
  await getMembership.save();
};

module.exports = {
    getMembers,
    getMemberById,
    removeMember,
    leaveProject
};

