const {getUserProfile, getProfilePicture, updateProfilePicture, removeProfilePicture} = require("./users.controller");
const {validateToken} = require("../auth/auth.middleware");
const upload = require("./users.middleware").upload.single("image");
const express = require("express");

const Router = express.Router();

Router.get("/get-profile", validateToken, getUserProfile);
Router.get("/get-profile-picture", validateToken, getProfilePicture);
Router.patch("/update-profile-picture", validateToken, upload, updateProfilePicture);
Router.patch("/remove-profile-picture", validateToken, removeProfilePicture);

module.exports = Router;

