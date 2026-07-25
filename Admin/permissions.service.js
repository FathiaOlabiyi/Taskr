// const permissionModel = require("./permissions.model");
// const rolePermissionModel = require("./role-permission.model");

// const createPermission = async({name}) => {
//     const existingPermission = await permissionModel.findOne({name});

//     if(existingPermission) {
//         throw new Error(`Permission with name "${name}" already exist`);
//     };
//     const createdPermission = await permissionModel.create({name});
//     return createdPermission;
// };

// const getAllPermissions = async() => {
//     const permissions = await permissionModel.find({deletedAt: null});
//     return permissions;
// };

// const getPermissionById = async(permissionId) => {
//     const permission = await permissionModel.findById(permissionId);

//     if(!permission) {
//         throw new Error("Permission not found")
//     };

//     if(permission.deletedAt != null) {
//         throw new Error("Permission has been deleted")
//     };
//     return permission
// };

// const deletePermission = async(permissionId) => {
//   const permission = await permissionModel.findById(permissionId);

//   if (!permission) {
//     throw new Error("Permission not found");
//   }

//   if (permission.deletedAt != null) {
//     throw new Error("Permission has been deleted");
//   }
//     permission.deletedAt = new Date();
//     await permission.save();
//     console.log(permission)

//     await rolePermissionModel.updateMany({ permission: permissionId, deletedAt: null }, {deletedAt: new Date()});

//     return permission;
// };

// module.exports = {
//     createPermission,
//     getAllPermissions,
//     getPermissionById,
//     deletePermission
// }