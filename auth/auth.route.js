const Controllers = require("./auth.controller");
const OAuth = require("./googleAuth");
const Middlewares = require("./auth.middleware");
const express = require("express");


const router = express.Router();

router.post("/signup", Controllers.signUp);
router.get("/verify-email", Controllers.verifyUserEmail); 
router.post("/resend-verification", Controllers.resendEmailVerificationLink);
router.post("/signin", Controllers.signIn); 
router.post("/forgot-password", Controllers.forgotPassword); 
router.post("/reset-password", Controllers.resetPassword);
router.patch("/:userId/delete-account", Middlewares.validateToken, Controllers.deleteAccount); 

//OAuth
const logger = require("../logger/winston");

router.get("/google", OAuth.googleLogin);
router.get("/google/callback", OAuth.googleCallback);

router.get("/success-callback", (req, res) => {
  const token = req.query.token;
  logger.info("Google authentication successful");
  res.json({
    message: "Google authentication successful",
    token,
  });
});

module.exports = router;
