// const Service = require("./role-permission.service");
// const mongoose = require("mongoose");
// const logger = require("../logger/winston");


// const createRolePermission = async(req, res) => {
//     const roleId = req.params.roleId;

//     const payload = req.body;
//     try{
//         if (!mongoose.Types.ObjectId.isValid(roleId)) {
//             logger.warn("Invalid RoleID format");
//             return res.status(400).json({
//                 message: "Invalid RoleID format"
//             });
//         }

//         const response = await Service.createRolePermission(roleId, payload.permission);
//         logger.info("Permission applied to role successfully");

//         res.status(201).json({
//             message: "Permission applied to role successfully",
//             data: response
//         });

//     }catch(err) {
//         if (
//           err &&
//           (err.message.includes("not found") || err.message.includes("deleted"))) {
//             logger.warn(err.message);
//           return res.status(404).json({
//             message: err.message,
//           });
//         };

//         if(err && err.message.includes("applied")) {
//             logger.warn(err.message);
//             return res.status(409).json({
//                 message: err.message
//             });
//         };

//         if(err && err.message.includes("invalid")) {
//             logger.warn(err.message);
//             return res.status(400).json({
//                 message: err.message
//             });
//         };

//         logger.error(err.message);
//         res.status(500).json({
//             message: "Internal server error",
//             error: err.message
//         });
//     };
// };

// const getAllRolePermission = async(req, res) => {
//     const roleId = req.params.roleId;
//     try {
//         if (!mongoose.Types.ObjectId.isValid(roleId)) {
//             logger.warn("Invalid RoleID format");
//             return res.status(400).json({
//             message: "Invalid RoleID format"
//         });
//         };
//         const response = await Service.getAllRolePermission(roleId);
//         logger.info("Role-permissions retrieved successfully");

//         res.status(200).json({
//             message: "Role-Permissions retrieved successfully",
//             data: response
//         });
//     }catch(err) {
//         if(err && (err.message.includes("not found") || err.message.includes("deleted"))) {
//             logger.warn(err.message);
//             return res.status(404).json({
//                 message: err.message
//             });
//         };

//         logger.error(err.message);
//         return res.status(500).json({
//             message: "Internal server error",
//             error: err.message
//         });
//     };
// };

// const getRolePermission = async(req, res) => {
//     const roleId = req.params.roleId;
//     const rolePermissionId = req.params.id;
//     try{
//         if (!mongoose.Types.ObjectId.isValid(roleId)) {
//             logger.warn("Invalid RoleID format");
//             return res.status(400).json({
//                 message: "Invalid RoleID format"
//             });
//         }
//         if (!mongoose.Types.ObjectId.isValid(rolePermissionId)) {
//             logger.warn("Invalid ID format");
//             return res.status(400).json({
//                 message: "Invalid ID format"
//             });
//         }
//         const response = await Service.getRolePermission(roleId, rolePermissionId);
//         logger.info("Role-permission retrieved successfully");

//         res.status(200).json({
//             message: "Role-Permission retrieved successfully",
//             data: response
//         });
//     }catch(err) {
//         if(err && (err.message.includes("not found") || err.message.includes("deleted") || err.message.includes("removed"))) {
//             logger.warn(err.message);
//             return res.status(404).json({
//                 message: err.message
//             });
//         };

//         logger.error(err.message);
//         return res.status(500).json({
//             message: "Internal server error",
//             error: err.message
//         });
//     };
// };

// const deleteRolePermission = async(req, res) => {
//     const roleId = req.params.roleId;
//     const rolePermissionId = req.params.id;

//      try{
//         if (!mongoose.Types.ObjectId.isValid(roleId)) {
//             logger.warn("Invalid RoleID format");
//             return res.status(400).json({
//                 message: "Invalid RoleID format"
//             });
//         }
//         if (!mongoose.Types.ObjectId.isValid(rolePermissionId)) {
//             logger.warn("Invalid ID format");
//             return res.status(400).json({
//                 message: "Invalid ID format"
//             });
//         }
//         const response = await Service.deleteRolePermission(roleId, rolePermissionId);
//          logger.info("Permission removed from role successfully");

//         res.status(204).json({
//             message: "Permission removed from role successfully",
//         });
//     }catch(err) {
//         if(err && (err.message.includes("not found") || err.message.includes("deleted") || err.message.includes("removed"))) {
//             logger.warn(err.message);
//             return res.status(404).json({
//                 message: err.message
//             });
//         };

//         logger.error(err.message);
//         return res.status(500).json({
//             message: "Internal server error",
//             error: err.message
//         });
//     }
// }

// module.exports = {
//     createRolePermission,
//     getAllRolePermission,
//     getRolePermission,
//     deleteRolePermission
// };