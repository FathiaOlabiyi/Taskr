const Services = require("./users.service");
const logger = require("../logger/winston");

const getUserProfile = async(req, res) => {
    try {
        const userId = req.user.id;
    
        const response = await Services.getUserProfile(userId);
        logger.info("Profile retrived successfully");

        return res.status(200).json({
            message: "Profile retrived successfully",
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
          error: err.message
        });
    };
}

const getProfilePicture = async(req, res) => {
    try {
        const userId = req.user.id;

        const response = await Services.getProfilePicture(userId);
        logger.info("Profile picture retrieved");

        return res.status(200).json({
            message: "Profile Picture retrieved successfully",
            data: response
        });
    }catch(err) {
      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message
        });
      }

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message
      });
    };
};

const updateProfilePicture = async(req, res) => {
    try {
        const userId = req.user.id;
        const profilePicture = req.file;
        console.log(profilePicture)

        const response = await Services.updateProfilePicture(userId, profilePicture);
        logger.info("Profile picture upload successful");

        return res.status(201).json({
            message: "Upload successful",
            data: response
        });
    }catch(err) {

      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message
        });
      }

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
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

const removeProfilePicture = async(req, res) => {
    try {
        const userId = req.user.id;

        const response = await Services.removeProfilePicture(userId);
        logger.info("Profile picture removed");

        return res.status(201).json({
            message: "Profile Picture removed"
        });
    }catch(err) {
      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message
        });
      }

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    };
};

module.exports = {
    getUserProfile,
    getProfilePicture,
    updateProfilePicture,
    removeProfilePicture
};