const Services = require("./auth.service");
const joiSchema = require("./auth.middleware");
const mongoose = require("mongoose");

const signUp = async(req, res) => {
    try{
        const {value, error} = joiSchema.signUpSchema.validate(req.body);

        if(error) {
            return res.status(400).json({error: error.message});
        };

        if(value) {
            const response = await Services.signUp(value);
            const token = response.jwtToken;
            return res.status(201).json({message: "User has been created successfully, An Email Verification Link has been sent to you, please verify your email",
                token: token
            });
        };
    }catch(err) {
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

const verifyUserEmail = async(req, res) => {
    try{
        const {email, token} = req.query;
        if(!email || !token) {
            return res.status(400).json({message: "Missing token or email"});
        };

        await Services.verifyUserEmail(email, token);
        return res.status(200).json({
            message: "Email verification successful"
        });

    }catch(err) {
        if(err && (err.message.includes("Invalid") || err.message.includes("expired"))) {
            return res.status(400).json({
                error: err.message
            });
        }

        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                error: err.message
            });
        }
        if(err && err.message.includes("already verified")) {
            return res.status(409).json({
                error: err.message
            });
        }

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
        return res.status(400).json({ error: error.message });
      }
      if(value) {
        await Services.resendEmailVerificationLink(value);
        return res.status(200).json({
            message: "Verification Link resent",
        });
      }
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                error: err.message
            });
        }
        if(err && err.message.includes("already verified")) {
            res.json({
                message: err.message
            });
        }

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
        return res.status(400).json({ error: error.message });
      }

      if(value) {
        const response = await Services.signIn(value);
        res.status(200).json({
          message: "User has Signed In successfully",
          data: response.token,
        });
      }

    }catch(err) {
      if (err && err.message.includes("not found")) {
        return res.status(404).json({
          error: err.message,
        });
      }

      if (err && err.message.includes("Invalid")) {
        return res.status(400).json({
          error: err.message,
        });
      }

      if (err && err.message.includes("not verified")) {
        return res.status(403).json({
          error: err.message,
        });
      }

      if (err && err.message.includes("Google")) {
        return res.status(400).json({
          error: err.message,
        });
      }

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
        return res.status(400).json({ error: error.message });
      }

      await Services.forgotPassword(value);
      res.status(200).json("Password Reset Link sent, Please check your email");
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                error: err.message
            });
        };

        if (err && err.message.includes("not verified")) {
          return res.status(403).json({
            error: err.message,
          });
        }

        if (err && err.message.includes("Google")) {
            return res.status(400).json({
              error: err.message,
            });
        }

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
            return res.status(400).json({message: "Missing token or email"});
        };

        const {value, error} = joiSchema.resetPasswordSchema.validate(req.body);

        if(error) {
            return res.status(400).json({
                error: error.message
            });
        };
        if(value) {
            await Services.resetPassword({ email, token}, value);
            res.status(200).json({
                message: "Password reset successful",
            });
        }
    }catch(err) {
        if (err && (err.message.includes("Invalid") || err.message.includes("expired"))) {
          return res.status(400).json({error: err.message});
        }

        if(err && err.message.includes("not found")) {
            return res.status(404).json({error: err.message})
        }
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const deleteAccount = async(req, res) => {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            message: "Invalid ID format",
        });
    }

    try {
        const deleteUser = await Services.deleteAccount(userId);
        res.status(204).json({
            message: "User has been deleted successfully",
        });
    }catch(err) {
        if (err && (err.message.includes("not found") || err.message.includes("deleted"))) {
            return res.status(404).json({
                message: err.message,
            });
        }

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