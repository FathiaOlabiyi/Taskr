
// const roleModel = require("./roles.model");
// const rolePermissionModel = require("./role-permission.model");

// const createRole = async({name}) => {
//     const existingRole = await roleModel.findOne({name});

//     if(existingRole) {
//         throw new Error(`Role with name "${name}" already exists`);
//     };

//     const createdRole = await roleModel.create({name});
//     return createdRole;
// };

// const getAllRoles = async() => {
//     const roles = await roleModel.find({deletedAt: null});
//     return roles;
// };

// const getRoleById = async(roleId) => {
//     const getRole = await roleModel.findById(roleId);

//     if(!getRole) {
//         throw new Error("Role not found");
//     }
//     if(getRole.deletedAt != null) {
//         throw new Error("Role has been deleted")
//     };

//     return getRole;
// };

// const deleteRole = async(roleId) => {
//     const getRole = await roleModel.findById(roleId);

//     if(!getRole) {
//         throw new Error("Role not found");
//     };

//     if (getRole.deletedAt != null) {
//         throw new Error("Role already deleted");
//     };

//     getRole.deletedAt = new Date();
//     await getRole.save();

//     await rolePermissionModel.updateMany({ role: roleId, deletedAt: null }, {deletedAt: new Date()});

//     return getRole;
// };

// module.exports = {
//     createRole, 
//     getAllRoles, 
//     getRoleById, 
//     deleteRole
// };
