const {createTask, getAllTasks, getTasksAssignedToMember, getTaskById, updateTask, updateStatus, deleteTask, assignTask, unassignTask} = require("./tasks.controller");
const {validateToken} = require("../auth/auth.middleware");
const {isMember, hasPermission} = require("../middlewares/authorizeMember.middleware");
const express = require("express");

const Router = express.Router();

Router.post("/:id/task", validateToken, isMember, hasPermission("Create Task"), createTask);
Router.get("/:id/task", validateToken, isMember, hasPermission("View Task"), getAllTasks);
Router.get("/:id/task/member/:memberId", validateToken, isMember, hasPermission("View Task"), getTasksAssignedToMember);
Router.get("/:id/task/:taskId", validateToken, isMember, hasPermission("View Task"), getTaskById);
Router.patch("/:id/task/:taskId", validateToken, isMember, hasPermission("Manage Task"), updateTask);
Router.patch("/:id/task/:taskId/status", validateToken, isMember, hasPermission("Manage Task"), updateStatus);
Router.patch("/:id/task/:taskId/delete", validateToken, isMember, hasPermission("Delete Task"), deleteTask);
Router.patch("/:id/task/:taskId/assign", validateToken, isMember, hasPermission("Assign Task"), assignTask);
Router.patch("/:id/task/:taskId/unassign", validateToken, isMember, hasPermission("Assign Tasks"), unassignTask);

module.exports = Router;