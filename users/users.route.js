const {getUserProfile, getProfilePicture, updateProfilePicture, removeProfilePicture} = require("./users.controller");
const {validateToken} = require("../auth/auth.middleware");
const upload = require("./users.middleware").upload.single("profile_picture");
const express = require("express");

const Router = express.Router();

Router.get("/profile", validateToken, getUserProfile);
Router.get("/profile-picture", validateToken, getProfilePicture);
Router.patch("/profile-picture", validateToken, upload, updateProfilePicture);
Router.patch("/profile-picture/remove", validateToken, removeProfilePicture);

module.exports = Router;

