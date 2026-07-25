const joi = require("joi");
const jwt = require("jsonwebtoken");
const Model = require("./auth.model");
require("dotenv").config();

const firstname = joi.string().pattern(/^[A-Za-z]+$/);
const lastname = joi.string().pattern(/^[A-Za-z]+$/);

const email = joi.string().email().lowercase().required().messages({"string.email": "Email must be a valid email"});
const password = joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")).required().messages({"string.pattern.base": "Password must be 8 characters long, must include at least a lowercase letter, an uppercase letter, a number and a special character"});

const signUpSchema = joi.object({
    firstname: firstname.required(),
    lastname: lastname.required(),
    email,
    password,
    profilePicture: joi.string(),
    confirmPassword: joi.any().valid(joi.ref("password")).required().messages({"any.only": "Confirm Password must match password"})
});

const signInSchema = joi.object({
    email,
    password
});

const resetPasswordSchema = joi.object({
    newPassword: password,
    confirmNewPassword: joi.any().valid(joi.ref("newPassword")).required().messages({"any.only": "Confirm Password must match new Password"})
});

const validateEmailOnlySchema = joi.object({
    email
});


const logger = require("../logger/winston");

const validateToken = async(req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;

        if(!bearerToken || !bearerToken.startsWith("Bearer ")) {
            logger.warn("Unauthorized");
            return res.status(403).json({message: "Unauthorized"});
        };

        const Token = bearerToken.split(" ")[1];

        if(!Token) {
            logger.warn("Unauthorized");
            return res.status(403).json({message: "Unauthorized"});
        };

        const validToken = jwt.verify(Token, process.env.JWT_SECRET);

        if(!validToken) {
            logger.warn("Unauthorized");
            return res.status(403).json({message: "Unauthorized"});
        };

        const user = await Model.findById(validToken.id);
        logger.info("User found");


        if(!user) {
            logger.warn("Unauthorized");
            return res.status(403).json({
                message: "Unauthorized"
            });
        }
        req.user = user;
        next();
    }catch(err) {
        logger.warn(err.message);
        return res.status(401).json({message: "Invalid Token", error: err.message});
    };
}


module.exports = {
    signUpSchema,
    signInSchema,
    resetPasswordSchema,
    validateEmailOnlySchema,
    validateToken
};
