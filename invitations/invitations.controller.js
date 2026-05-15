const Services = require("./invitations.service");
const joi = require("./invitations.middleware");

const createInvitation = async(req, res) => {
    try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const {value, error} = joi.createInvitationJoi.validate(req.body);

    if(error) {
        return res.status(400).json({
            message: error.message
        });
    };
    const response = await Services.createInvitation(projectId, value, userId);
    return res.status(201).json({
        message: "Invitation created successfully",
        data: response
    });
    }catch(err) {
        if(err && [err.message.includes("exists")|| err.message.includes("allowed") || err.message.includes("cannot be greater than")]) {
            return res.status(409).json({
                message: err.message
            });
        };

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const sendInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;

        const response = await Services.sendInvitation(invitationId);
        return res.status(201).json({
            message: "Invitation sent successfully",
            data: response
        });

    }catch(err) {

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("draft") || err.message.includes("scheduled")]) {
            return res.status(409).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const validateInvitation = async(req, res) => {
    try {
        const { token, email } = req.query;

        if(!token || !email) {
            return res.status(400).json({
                message: "Missing token or email"
            });
        };
        await Services.validateInvitation(token, email);
        return res.status(200).json({
            message: "Validation successful"
        });

    }catch(err) {
        if(err && [err.message.includes("not valid") || err.message.includes("expired")]) {
            return res.status(400).json({
                message: err.message
            });
        };

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const acceptInvitation = async(req, res) => {
    try {
        const {email, token} = req.query;
        const userId = req.user.id;

        await Services.acceptInvitation(email, token, userId);
        return res.status(200).json({
            message: "Invitation accepted"
        });

    }catch(err) {

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("accepted") || err.message.includes("expired") || err.message.includes("your invite")]) {
            return res.status(400).json({
                message: err.message
            });
        };

        if(err && err.message.includes("exists")) {
            return res.status(409).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const rejectInvitation = async(req, res) => {
    try {
        const {email, token} = req.query;

        await Services.rejectInvitation(email, token)
    }catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const revokeInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;

        const response = await Services.revokeInvitation(invitationId);

        return res.status(201).json({
            message: "Invitation revoked",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("revoked") || err.message.includes("expired")]) {
            return res.status(409).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const rescheduleInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;
        const {value, error} = joi.rescheduleInvitationJoi.validate(req.body);

        if(error) {
            return res.status(400).json({
                message: error.message
            });
        };
        const response = await Services.rescheduleInvitation(invitationId, value);
        return res.status(201).json({
            message: "Invitation rescheduled"
        });
        }catch(err) {
            if(err && err.message.includes("not found")) {
                return res.status(404).json({
                    message: err.message
                });
            };

            if(err && err.message.includes("rescheduled")) {
                return res.status(409).json({
                    message: err.message
                });
            };
            res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        };
};

const getInvitations = async(req, res) => {
    try {
        const projectId = req.params.id;
        const status = req.query

        const response = await Services.getInvitations(projectId, status);
        return res.status(200).json({
            message: "Invitations returned succefully",
            data: response
        });

    }catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const getInvitationById = async(req, res) => {
    try {
        const invitationId = res.params.invitationId;

        const response = await Services.getInvitationById(invitationId);
        return res.status(200).json({
            message: "Invitation returned successfully",
            data: response
        });

    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const updateInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;
        const {value, error} = joi.updateInvitationJoi.validate(req.body);

        if(error) {
            res.status(400).json({
                message: error.message
            });
        };

        const response = await Services.updateInvitation(invitationId, value);
        return res.status(201).json({
            message: "Update successful",
            data: response
        });
    }catch(err) {

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.mesaage
            });
        };

        if(err && [err.message.includes("updated") || err.message.includes("allowed") || err.message.includes("greater than")]) {
            return res.status(409).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const deleteInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;

        await Services.deleteInvitation(invitationId);
        return res.status(204).json({
            message: "Deletion successful"
        });

    }catch(err) {

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if (err && err.message.includes("deleted")) {
            return res.status(409).json({
                message: err.message
            });
        };
          res.status(500).json({
            message: "Internal server error",
            error: err.message,
          });
    };
};

module.exports = {
    createInvitation,
    sendInvitation,
    validateInvitation,
    acceptInvitation,
    rejectInvitation,
    revokeInvitation,
    rescheduleInvitation,
    getInvitations,
    getInvitationById,
    updateInvitation,
    deleteInvitation
};