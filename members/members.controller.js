const Services = require("./members.service");
const logger = require("../logger/winston");

const getMembers = async(req, res) => {
    try {
        const projectId = req.params.id;
        const query = req.query;

        const response = await Services.getMembers(projectId, query.role);
        logger.info("Members retrieved successfully");

        return res.status(200).json({
            message: "Members retrieved successfully",
            data: response
        });
    }catch(err) {

        if(err && err.message.includes("exists")) {
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
    }
};

const getMemberById = async(req, res) => {
    try {
        const memberId = req.params.memberId;

        const response = await Services.getMemberById(memberId);
        logger.info("Member retrived successfully");

        return res.status(200).json({
            message: "Member retrived successfully",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);

            return res.status(404).json({
                message: err.message
            });
        };

        if(err && err.message.includes("Invalid")) {
            logger.warn(err.message);
            return res.status(400).json({
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

const removeMember = async(req, res) => {
    try {
        const userId = req.user.id;
        const memberId = req.params.memberId;
        const projectId = req.params.id;

        const response = await Services.removeMember(userId, memberId, projectId);
        logger.info("Member successfully removed");

        return res.status(204).json({
            message: "Member successfully removed"
        });
    }catch(err) {
      if (err && err.message.includes("not found")) {
        logger.warn(err.message);

        return res.status(404).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }

      if (
        err && [
          err.message.includes("Forbidden") || err.message.includes("allowed") || err.message.includes("continue")
        ]
      ) {
        logger.warn(err.message);

        return res.status(409).json({
          message: err.message,
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
};

const leaveProject = async(req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;

        const response = await Services.leaveProject(userId, projectId);
        logger.info("You are no longer a member");

        return res.status(204).json({
            message: "You are no longer a member"
        });
    }catch(err) {
      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("continue") || err && err.message.includes("Owner")) {
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
};

module.exports = {
    getMembers,
    getMemberById,
    removeMember,
    leaveProject
};

