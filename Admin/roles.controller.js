const roleServices = require("./roles.service");
const joiSchema = require("./roles.middleware");
const mongoose = require("mongoose");
const logger = require("../logger/winston");


const createRoleController = async(req, res) => {
    try{
        const { value, error } = joiSchema.joiSchema.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            })
        };

        const response = await roleServices.createRole(value);
        logger.info("Roles created successfully");

        res.status(201).json({
            message: "Role created successfully",
            data: response
        });

    }catch(error) {
        if(error && error.message.includes("exists")) {
            logger.warn(error.message);
            return res.status(409).json({
                message: error.message
            });
        }

        logger.error(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllRolesController = async(req, res) => {
    try {
        const response = await roleServices.getAllRoles();
        logger.info("Roles retrieved successfully");

        return res.status(200).json({
            message: "Roles retrieved successfully",
            data: response
        });
    }catch(error) {
        logger.error(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    };
};

const getRoleByIdController = async(req, res) => {
    const roleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        logger.warn("Invalid ID format");
        return res.status(400).json({
            message: "Invalid ID format"
        });
    }
    try {
        const role = await roleServices.getRoleById(roleId);
        logger.info("Roles retrived successfully");

        return res.status(200).json({
            message: "Role retrived successfully",
            data: role
        });

    }catch(err) {
        if(err && (err.message.includes("not found") || err.message.includes("deleted"))) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const deleteRoleController = async(req, res) => {
    const roleId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        logger.warn("Invalid ID format");
        return res.status(400).json({
            message: "Invalid ID format",
        });
    }
    try {
        const deleteRole = await roleServices.deleteRole(roleId);
        logger.info("Role deleted successfully");

        return res.status(204).json({
            message: "Role deleted successfully",
        });

    }catch(err) {
        if(err && (err.message.includes("not found") || err.message.includes("deleted"))) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        }

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            data: err.message
        });
    }
};

module.exports = {
    createRoleController,
    getAllRolesController,
    getRoleByIdController,
    deleteRoleController
};