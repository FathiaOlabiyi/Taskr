const Services = require("./invitations.service");
const joi = require("./invitations.middleware");
const logger = require("../logger/winston");

const createInvitation = async(req, res) => {
    try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const {value, error} = joi.createInvitationJoi.validate(req.body);

    if(error) {
        logger.warn(error.message);
        return res.status(400).json({
            message: error.message
        });
    };
    const response = await Services.createInvitation(projectId, value, userId);
    logger.info("Invitation created successfully");

    return res.status(201).json({
        message: "Invitation created successfully",
        data: response
    });

    }catch(err) {
        if(err && [err.message.includes("Invitation") || err.message.includes("allowed") || err.message.includes("belongs")]) {
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        };

        if(err && err.message.includes("Not found")) {
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

const sendInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;
        const userId = req.user.id;
        const projectId = req.params.id;

        const response = await Services.sendInvitation(invitationId, userId, projectId);
        logger.info("Invitation sent successfully");

        return res.status(201).json({
            message: "Invitation sent successfully",
            data: response
        });

    }catch(err) {
        if(err && err.message.includes("Invalid")) {
            logger.warn(err.message);
            return res.status(400).json({
                message: err.message
            });
        }

        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("allowed") || err.message.includes("cannot send")]) {
            logger.warn(err.message);
            return res.status(409).json({
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

const getInvitation = async(req, res) => {
    try {
        const token = req.params.token;
        const response = await Services.getInvitation(token);
        logger.info("Successful");

        return res.status(200).json({
            message: "Successful",
            data: response
        });
    }catch(err) {
        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const acceptInvitation = async(req, res) => {
    try {
        const token = req.params.token;
        const userId = req.user.id;

        await Services.acceptInvitation(token, userId);
        logger.info("Invitation accepted");

        return res.status(200).json({
            message: "Invitation accepted"
        });

    }catch(err) {

        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("member") || err.message.includes("expired") || err.message.includes("yours") || err.message.includes("valid")]) {
            logger.warn(err.message);
            return res.status(400).json({
                message: err.message
            });
        };

        if(err && err.message.includes("exists")) {
            logger.warn(err.message);
            return res.status(409).json({
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

const rejectInvitation = async(req, res) => {
    try {
        const token = req.params.token;
        const userId = req.user.id;

        await Services.rejectInvitation(token, userId);
        logger.info("Invitation has been rejected");

    }catch(err) {
      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message,
        });
      }

      if (
        err && [
            err.message.includes("expired") ||
            err.message.includes("yours") ||
            err.message.includes("valid"),
        ]
      ) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    };
};

const revokeInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;

        const response = await Services.revokeInvitation(invitationId);
        logger.info("Invitation revoked");

        return res.status(201).json({
            message: "Invitation revoked",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("revoked") || err.message.includes("expired")]) {
            logger.warn(err.message);
            return res.status(409).json({
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

const rescheduleInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;
        const {value, error} = joi.rescheduleInvitationJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        };
        const response = await Services.rescheduleInvitation(invitationId, value);
        logger.info("Invitation rescheduled");

        return res.status(201).json({
            message: "Invitation rescheduled"
        });
        }catch(err) {
            if(err && err.message.includes("not found")) {
                logger.warn(err.message);
                return res.status(404).json({
                    message: err.message
                });
            };

            if(err && err.message.includes("rescheduled")) {
                logger.warn(err.message);
                return res.status(409).json({
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

const resendInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;
        const userId = req.user.id;
        const projectId = req.params.id;

        const response = await Services.sendInvitation(invitationId, userId, projectId);
        logger.info("Invitation resent");

        return res.status(201).json({
            message: "Invitation resent",
            data: response
        });
    } catch(err) {

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message,
        });
      }

      if (err && [err.message.includes("allowed") || err.message.includes("resent")]) {
        logger.warn(err.message);
        return res.status(409).json({
          message: err.message,
        });
      };

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    };
}

const getInvitations = async(req, res) => {
    try {
        const projectId = req.params.id;
        const status = req.query

        const response = await Services.getInvitations(projectId, status);
        logger.info("Invitations returned successfully");

        return res.status(200).json({
            message: "Invitations returned succefully",
            data: response
        });

    }catch(err) {
        logger.error(err.message);

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
        logger.info("Invitation returned successfully");

        return res.status(200).json({
            message: "Invitation returned successfully",
            data: response
        });

    }catch(err) {
        if(err && err.message.includes("not found")) {
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

const updateInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;
        const {value, error} = joi.updateInvitationJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            res.status(400).json({
                message: error.message
            });
        };

        const response = await Services.updateInvitation(invitationId, value);
        logger.info("Inivtation update successful");

        return res.status(201).json({
            message: "Update successful",
            data: response
        });
    }catch(err) {

        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.mesaage
            });
        };

        if(err && [err.message.includes("updated") || err.message.includes("allowed") || err.message.includes("greater than")]) {
            logger.warn(err.message);
            return res.status(409).json({
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

const deleteInvitation = async(req, res) => {
    try {
        const invitationId = req.params.invitationId;

        await Services.deleteInvitation(invitationId);
        logger.info("Invitation deleted successfully");

        return res.status(204).json({
            message: "Deletion successful"
        });

    }catch(err) {

        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if (err && err.message.includes("deleted")) {
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        };
        logger.error(err.message);
          res.status(500).json({
            message: "Internal server error",
            error: err.message,
          });
    };
};

module.exports = {
    createInvitation,
    sendInvitation,
    getInvitation,
    acceptInvitation,
    rejectInvitation,
    revokeInvitation,
    rescheduleInvitation,
    resendInvitation,
    getInvitations,
    getInvitationById,
    updateInvitation,
    deleteInvitation
};