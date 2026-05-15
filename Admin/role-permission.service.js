const Model = require("./role-permission.model");
const roleModel = require("./roles.model");
const permissionModel = require("./permissions.model");
const mongoose = require("mongoose");


const createRolePermission = async(roleId, permission) => {
  const findRole = await roleModel.findById(roleId);

  if (!findRole) {
    throw new Error("Role not found");
  };

  if (findRole.deletedAt != null) {
    throw new Error("Role has been deleted");
  };

  if(!mongoose.Types.ObjectId.isValid(permission)) {
    throw new Error("PermissionID format is invalid")
  };

  const findPermission = await permissionModel.findById(permission);

  if (!findPermission) {
    throw new Error("Permission not found");
  };

  if (findPermission.deletedAt != null) {
    throw new Error("Permission has been deleted");
  };

  const findRolePermission = await Model.findOne({role: roleId, permission: permission});
  

  if(findRolePermission) {
    throw new Error("Permission has already been applied to role");
  };

  const rolePermission = await Model.create({
    role: roleId,
    permission: permission,
  });

  return rolePermission;
};

const getAllRolePermission = async(roleId) => {
  const findRole = await roleModel.findById(roleId);
  if(!findRole) {
    throw new Error("Role not found")
  };

  if(findRole.deletedAt != null) {
    throw new Error("Role has been deleted")
  };

  const getRolePermissions = await Model.find({deletedAt: null});
  return getRolePermissions;
};

const getRolePermission = async(roleId, rolePermissionId) => {
  const findRolePermission = await Model.findById(rolePermissionId);
  if(!findRolePermission) {
    throw new Error("Role-permission not found");
  };

  if(findRolePermission.deletedAt != null) {
    throw new Error("Permission has been removed from role");
  };

  const findRole = await roleModel.findById(roleId);
  if(!findRole) {
    throw new Error("Role not found");
  };

  if(findRole.deletedAt != null) {
    throw new Error("Role has been deleted");
  };

  const findPermissionId = findRolePermission.permission;
  const findPermission = await permissionModel.findById(findPermissionId);

  if(findPermission.deletedAt != null) {
    throw new Error("Permission has been deleted");
  }

  return findRolePermission;
};

const deleteRolePermission = async(roleId, rolePermissionId) => {
  const findRolePermission = await Model.findById(rolePermissionId);
  if (!findRolePermission) {
    throw new Error("Role-permission not found");
  }

  if (findRolePermission.deletedAt != null) {
    throw new Error("Permission has been removed from role");
  }

  const findRole = await roleModel.findById(roleId);
  if (!findRole) {
    throw new Error("Role not found");
  }

  if (findRole.deletedAt != null) {
    throw new Error("Role has been deleted");
  }

  const findPermissionId = findRolePermission.permission;
  const findPermission = await permissionModel.findById(findPermissionId);

  if (findPermission.deletedAt != null) {
    throw new Error("Permission has been deleted");
  }

  findRolePermission.deletedAt = new Date();
  await findRolePermission.save();
  return findRolePermission;
}


module.exports = {
    createRolePermission,
    getAllRolePermission,
    getRolePermission,
    deleteRolePermission
};