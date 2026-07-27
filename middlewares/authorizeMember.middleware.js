const memberModel = require("../members/members.model");
const rolePermissionModel = require("../Admin/role-permission.model");
const permissionModel = require("../Admin/permissions.model");
const projectModel = require("../projects/projects.model");
const taskModel = require("../tasks/tasks.model");
const mongoose = require("mongoose");
const logger = require("../logger/winston");

const isMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      logger.warn("Invalid ID format");
      return res.status(400).json({
        message: "Invalid ID format"
        });
    };

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      logger.warn("Invalid ID format");
      return res.status(400).json({
        message: "Invalid ID format"
      });
      };

    const checkProject = await projectModel.findById(projectId);

    if(!checkProject || checkProject.deletedAt !== null) {
      logger.warn("Project not found");
      return res.status(404).json({
        message: "Project not found"
      });
    };

    const checkMember = await memberModel.findOne({
      projectId: projectId,
      userId: userId,
    });
    if (!checkMember || checkMember.deletedAt !== null) {
      logger.warn("Unauthorized");
      return res.status(403).json({
        message: "Unauthorized"
      });
    };

    req.member = checkMember;
    next();
  } catch (err) {
    logger.error(err.message);
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

      const fetchPermission = await permissionModel.findOne({ name: permission });

      if(!fetchPermission) {
        return res.status(404).json({message: "Permission not found"})
      };

      const getPermission = fetchPermission._id;

      const checkPermission = await rolePermissionModel.findOne({
        role,
        permission: getPermission
      });

      if (!checkPermission) {
        logger.warn("You do not have permission");
        return res.status(403).json({
          message: "You do not have permission",
        });
      }
      next();
    } catch(err) {
      logger.error(err.message);
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
