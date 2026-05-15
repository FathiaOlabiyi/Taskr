const memberModel = require("../members/members.model");
const rolePermissionModel = require("../Admin/role-permission.model");
const permissionModel = require("../Admin/permissions.model");
const projectModel = require("../projects/projects.model");
const taskModel = require("../tasks/tasks.model");
const mongoose = require("mongoose");

const isMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid ID format"
        });
    };

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "Invalid ID format"
      });
      };

    const checkProject = await projectModel.findById(projectId);

    if(!checkProject || checkProject.deletedAt != null) {
      return res.status(404).json({
        message: "Project not found"
      });
    };

    const checkMember = await memberModel.findOne({
      projectId: projectId,
      userId: userId,
    });
    if (!checkMember || checkMember.deleteAt != null) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    };

    req.member = checkMember;
    next();
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

//If i have to delete a role or permission or role permission, i have to come back here
const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const memberId = req.member._id;
      const findRole = await memberModel.findById(memberId);

      const role = findRole.role;

      const getPermission = await permissionModel.findOne({ name: permission })._id;

      const checkPermission = await rolePermissionModel.findOne({
        role,
        getPermission,
      });

      if (!checkPermission) {
        return res.status(500).json({
          message: "You do not have permission",
        });
      }
      next();
    } catch(err) {
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  };
};

module.exports = {
  isMember,
  hasPermission,
};
