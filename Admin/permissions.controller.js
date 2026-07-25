// const permissionServices = require("./permissions.service");
// const joiSchema = require("./permissions.middleware");
// const mongoose = require("mongoose");
// const logger = require("../logger/winston");

// const createPermission = async(req, res) => {
//     try {
//         const { value, error } = joiSchema.joiSchema.validate(req.body);

//         if(error) {
//             logger.warn(error.message);
//             return res.status(400).json({
//                 message: error.message
//             });
//         };
//         const response = await permissionServices.createPermission(value);
//         logger.info("Permission created successfully");
//         res.status(201).json({
//             message: "Permission created successfully",
//             data: response
//         });

//     }catch(err) {
//         if(err && err.message.includes("exists")) {
//             logger.warn(err.message);
//             return res.status(409).json({
//                 error: err.message
//             });
//         }

//         logger.error(err.message);
//         res.status(500).json({
//             message: "Internal server error",
//             error: err.message
//         });
//     };
// }

// const getAllPermissions = async(req, res) => {
//    try{
//     const response = await permissionServices.getAllPermissions();
//     logger.info("Permissions retrived successfully");

//     res.status(200).json({
//         message: "Permissions retrieved successfully",
//         data: response
//     });
//    }catch(err) {
//     logger.error(err.message);

//     res.status(500).json({
//         message: "Internal server error",
//         error: err.message
//     });
//    }
// };


// const getPermissionById = async(req, res) => {
//     const permissionId = req.params.id;
    
//     if (!mongoose.Types.ObjectId.isValid(permissionId)) {
//         logger.warn("Invalid ID format");
//         return res.status(400).json({
//             message: "Invalid ID format"
//         });
//     }

//     try {
//         const response = await permissionServices.getPermissionById(permissionId);
//         logger.info("Permission retrieved successfully");

//         res.status(200).json({
//             message: "Permission retrieved successfully",
//             data: response
//         });
//     }catch(error) {
//         if(error && (error.message.includes("not found") || error.message.includes("deleted"))) {
//             logger.warn(error.message);
//             return res.status(404).json({
//                 message: error.message
//             });
//         }

//         logger.error(error.message);
//         res.status(500).json({
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// }

// const deletePermission  =async(req, res) => {
//     const permissionId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(permissionId)) {
//         logger.warn("Invalid ID format");
//       return res.status(400).json({
//         message: "Invalid ID format",
//       });
//     }

//     try{
//         const deletePerm = await permissionServices.deletePermission(permissionId);
//         logger.info("Permission deleted successfully");

//         res.status(204).json({
//             message: "Permission deleted successfully",
//         });
//     }catch(err) {
//         if(err && (err.message.includes("not found") || err.message.includes("deleted"))) {
//             logger.warn(err.message);
//             return res.status(404).json({
//                 message: err.message
//             });
//         }

//         logger.error(err.message);
//         res.status(500).json({
//             message: "Internal server error",
//             error: err.message
//         });
//     }
// }

// module.exports = {
//     createPermission,
//     getAllPermissions,
//     getPermissionById,
//     deletePermission
// };