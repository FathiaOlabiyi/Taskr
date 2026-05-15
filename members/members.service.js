const Model = require("./members.model");
const taskModel = require("../tasks/tasks.model");
const roelModel = require("../Admin/roles.model");

//check
const getMembers = async(projectId, role) => {
    let query = {}

    if(role) {
        query.role = { $regex: status, $options: "i" };
    }
  const members = await Model.find({projectId, query, deletedAt: null});
  return members;
};

//check
const getMemberById = async(memberId) => {
    const getMember = await Model.findById(memberId);

    if(!getMember || getMember.deletedAt != null) {
        throw new Error("Member not found")
    };

    return getMember;
};


//come back to this too for the PMs
const updateMemberRole = async(memberId, role) => {
  const getMember = await Model.findById(memberId);
  const memberRole = await getMember.role;

  if (!getMember || getMember.deletedAt != null) {
    throw new Error("Member not found");
  };

  const getRoleName = await roleModel.findById(memberRole);
  const roleName = getRoelName.name;

  if(roleName == "Owner") {
    throw new Error("Forbidden")
  };

  memberRole = role;
  await getMember.save();
};


//this is one of the endpoints where the member themselves alongside pms and owner;
//come back for the pms 
const deleteMember = async(userId) => {
  const getMember = await Model.findById(memberId);
  const memberRole = getMember.role;

  const getRoleName = await roleModel.findById(memberRole);
  const roleName = getRoelName.name;

  if (!getMember || getMember.deletedAt != null) {
    throw new Error("Member not found");
  };

  if(roleName == "Owner") {
    throw new Error("Owner cannot be deleted")
  };
  getMember.deletedAt = Date.now();
  await getMember.save();

};

module.exports = {
    getMembers,
    getMemberById,
    updateMemberRole,
    deleteMember
};

