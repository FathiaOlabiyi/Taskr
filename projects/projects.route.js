const {createProject, getAllProjects, getProjectById, updateProject, updateStatus, deleteProject} = require("./projects.controller");
const {validateToken} = require("../auth/auth.middleware");
const {isMember, hasPermission} = require("../middlewares/authorizeMember.middleware");
const express = require("express");

const Router = express.Router();


//I have not tested the permissions yet
Router.post("/", validateToken, createProject); //check
Router.get("/", validateToken, getAllProjects); //check for owners, check later for members
Router.get("/:id", validateToken, isMember, hasPermission("View Project"), getProjectById); //check for owners, check later for members too
Router.patch("/:id", validateToken, isMember, hasPermission("Edit Project"), updateProject); //check for owner, check for members too
Router.patch("/:id/status", validateToken, isMember, hasPermission("Edit Project"), updateStatus); //check for owner, check for when you have tasks and members
Router.patch("/:id/delete", validateToken, isMember, hasPermission("Delete Project"), deleteProject); //not checked yet at all



module.exports = Router;