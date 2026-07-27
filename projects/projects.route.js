const {createProject, getAllProjects, getProjectById, updateProject, updateStatus, deleteProject} = require("./projects.controller");
const {validateToken} = require("../auth/auth.middleware");
const {isMember, hasPermission} = require("../middlewares/authorizeMember.middleware");
const express = require("express");

const Router = express.Router();


//I have not tested the permissions yet
Router.post("/", validateToken, createProject);
Router.get("/", validateToken, getAllProjects);
Router.get("/:id", validateToken, isMember, hasPermission("View Project"), getProjectById);
Router.patch("/:id", validateToken, isMember, hasPermission("Edit Project"), updateProject);
Router.patch("/:id/status", validateToken, isMember, hasPermission("Edit Project"), updateStatus);
Router.patch("/:id/delete", validateToken, isMember, hasPermission("Delete Project"), deleteProject);



module.exports = Router;