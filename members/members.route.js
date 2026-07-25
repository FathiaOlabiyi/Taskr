const {getMembers, getMemberById, removeMember, leaveProject} = require("./members.controller");
const {validateToken} = require("../auth/auth.middleware");
const {isMember, hasPermission} = require("../middlewares/authorizeMember.middleware");
const express = require("express");

const Router = express.Router();

Router.get("/:id/members", validateToken, isMember, hasPermission("Manage Members"), getMembers);
Router.get("/:id/member/:memberId", validateToken, isMember, hasPermission("Manage Members"), getMemberById);
Router.patch("/:id/member/:memberId/remove", validateToken, isMember, hasPermission("Manage Members"), removeMember);
Router.patch("/:id/member/leave", validateToken, isMember, leaveProject);

module.exports = Router;