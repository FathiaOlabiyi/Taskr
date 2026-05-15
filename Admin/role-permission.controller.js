const Service = require("./role-permission.service");
const mongoose = require("mongoose");

const createRolePermission = async(req, res) => {
    const roleId = req.params.roleId;

    const payload = req.body;
    try{
        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                message: "Invalid RoleID format"
            });
        }

        const response = await Service.createRolePermission(roleId, payload.permission);
        res.status(201).json({
            message: "Permission applied to role successfully",
            data: response
        });

    }catch(err) {
        if (
          err &&
          (err.message.includes("not found") || err.message.includes("deleted"))) {
          return res.status(404).json({
            message: err.message,
          });
        };

        if(err && err.message.includes("applied")) {
            return res.status(409).json({
                message: err.message
            });
        };

        if(err && err.message.includes("invalid")) {
            return res.status(400).json({
                message: err.message
            });
        };
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const getAllRolePermission = async(req, res) => {
    const roleId = req.params.roleId;
    try {
        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
            message: "Invalid RoleID format"
        });
        };
        const response = await Service.getAllRolePermission(roleId);
        res.status(200).json({
            message: "Role-Permissions retrieved successfully",
            data: response
        });
    }catch(err) {
        if(err && (err.message.includes("not found") || err.message.includes("deleted"))) {
            return res.status(404).json({
                message: err.message
            });
        };
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const getRolePermission = async(req, res) => {
    const roleId = req.params.roleId;
    const rolePermissionId = req.params.id;
    try{
        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                message: "Invalid RoleID format"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(rolePermissionId)) {
            return res.status(400).json({
                message: "Invalid ID format"
            });
        }
        const response = await Service.getRolePermission(roleId, rolePermissionId);
        res.status(200).json({
            message: "Role-Permission retreived successfully",
            data: response
        });
    }catch(err) {
        if(err && (err.message.includes("not found") || err.message.includes("deleted") || err.message.includes("removed"))) {
            return res.status(404).json({
                message: err.message
            });
        };
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const deleteRolePermission = async(req, res) => {
    const roleId = req.params.roleId;
    const rolePermissionId = req.params.id;

     try{
        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                message: "Invalid RoleID format"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(rolePermissionId)) {
            return res.status(400).json({
                message: "Invalid ID format"
            });
        }
        const response = await Service.deleteRolePermission(roleId, rolePermissionId);
        res.status(204).json({
            message: "Permission removed from role successfully",
        });
    }catch(err) {
        if(err && (err.message.includes("not found") || err.message.includes("deleted") || err.message.includes("removed"))) {
            return res.status(404).json({
                message: err.message
            });
        };
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

module.exports = {
    createRolePermission,
    getAllRolePermission,
    getRolePermission,
    deleteRolePermission
};