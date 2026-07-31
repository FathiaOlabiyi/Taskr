const Services = require("./auth.service");
const joiSchema = require("./auth.middleware");
const mongoose = require("mongoose");
const logger = require("../logger/winston");

const signUp = async(req, res) => {
    try{
        const {value, error} = joiSchema.signUpSchema.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({error: error.message});
        };

        if(value) {
            const response = await Services.signUp(value);
            const token = response.jwtToken;
            logger.info("User created successfully");

            return res.status(201).json({message: "User has been created successfully, An Email Verification Link has been sent to you, please verify your email",
                token: token
            });
        };
    }catch(err) {
        if(err && [err.message.includes("exists") || err.message.includes("deleted")]) {
            logger.warn(err.message)
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

const verifyUserEmail = async(req, res) => {
    try{
        const {email, token} = req.query;
        if(!email || !token) {
            logger.warn("Missing token or email");
            return res.status(400).json({message: "Missing token or email"});
        };

        await Services.verifyUserEmail(email, token);
        logger.info("Email verification successful");
        return res.status(200).json({
            message: "Email verification successful"
        });

    }catch(err) {
        if(err && (err.message.includes("Invalid") || err.message.includes("expired"))) {
            logger.warn(err.message);
            return res.status(400).json({
                error: err.message
            });
        }

        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                error: err.message
            });
        }
        if(err && err.message.includes("already verified")) {
            logger.warn(err.message);
            return res.status(409).json({
                error: err.message
            });
        }

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
};

const resendEmailVerificationLink = async(req, res) => {
    try {
      const {value, error } = joiSchema.validateEmailOnlySchema.validate(req.body);

      if (error) {
        logger.info(error.message);
        return res.status(400).json({ error: error.message });
      }
      if(value) {
        await Services.resendEmailVerificationLink(value);
        logger.info("Verification Link resent");
        return res.status(200).json({
            message: "Verification Link resent",
        });
      }
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                error: err.message
            });
        }
        if(err && err.message.includes("already verified")) {
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        }

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
};

const signIn = async(req, res) => {
    try {
        const {value, error} = joiSchema.signInSchema.validate(req.body);

      if (error) {
        logger.warn(error.message);
        return res.status(400).json({ error: error.message });
      }

      if(value) {
        const response = await Services.signIn(value);
        logger.info("User has Signed in successfully");
        res.status(200).json({
          message: "User has Signed In successfully",
          token: response.token,
        });
      }

    }catch(err) {
      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          error: err.message,
        });
      }

      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          error: err.message,
        });
      }

      if (err && err.message.includes("not verified")) {
        logger.warn(err.message);
        return res.status(403).json({
          error: err.message,
        });
      }

      if (err && err.message.includes("Google")) {
        logger.warn(err.message);
        return res.status(400).json({
          error: err.message,
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
};

const forgotPassword = async(req, res) => {
    try {
      const { value, error } = joiSchema.validateEmailOnlySchema.validate(req.body);

      if (error) {
        logger.warn(error.message);
        return res.status(400).json({ error: error.message });
      }

      await Services.forgotPassword(value);
      logger.info("Password reset link sent");
      res.status(200).json("Password Reset Link sent, Please check your email");

    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                error: err.message
            });
        };

        if (err && err.message.includes("not verified")) {
            logger.warn(err.message);
          return res.status(403).json({
            error: err.message,
          });
        }

        if (err && err.message.includes("Google")) {
            logger.warn(err.message);
            return res.status(400).json({
              error: err.message,
            });
        }

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",

            error: err.message
        });
    }
};

const resetPassword = async(req, res) => {
    try {
        const {email, token} = req.query;

        if(!email || !token) {
            logger.warn("Missing token or email");
            return res.status(400).json({message: "Missing token or email"});
        };

        const {value, error} = joiSchema.resetPasswordSchema.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                error: error.message
            });
        };
        if(value) {
            await Services.resetPassword({ email, token}, value);
            logger.info("Password reset successful");
            res.status(200).json({
                message: "Password reset successful",
            });
        }
    }catch(err) {
        if (err && (err.message.includes("Invalid") || err.message.includes("expired"))) {
            logger.warn(err.message);
          return res.status(400).json({error: err.message});
        }

        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({error: err.message})
        }

        if (err && err.message.includes("Google")) {
            logger.warn(err.message);
          return res.status(400).json({
            error: err.message,
          });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const deleteAccount = async(req, res) => {
    const userId = req.user.id;

    try {
        const deleteUser = await Services.deleteAccount(userId);
        logger.info("User has been deleted successfully");
        res.status(204).json({
            message: "User has been deleted successfully",
        });
    }catch(err) {
        if (err && (err.message.includes("not found") || err.message.includes("deleted"))) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message,
            });
        }

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

module.exports = {
    signUp,
    verifyUserEmail,
    resendEmailVerificationLink,
    signIn,
    forgotPassword,
    resetPassword,
    deleteAccount
};