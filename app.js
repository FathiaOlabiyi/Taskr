const express = require("express");
const db = require("./config/db");
const passport = require("passport");
require("dotenv").config();

const app = express();
app.use(express.json());

//connect to database
db.connection();

app.get("/homepage", (req, res) => {
    res.status(200).json("Welcome to Task/Project Management API Homepage")
});

// admin routes
const rolesRoute = require("./Admin/roles.route");
const rolePermissionRoute = require("./Admin/role-permission.route");
app.use("/api/v1/admin/role", rolesRoute, rolePermissionRoute);

const permissionRoute = require("./Admin/permissions.route");
app.use("/api/v1/admin/permission", permissionRoute);


// app.use("/api/v1/admin/role", rolePermissionRoute);


//User routes
app.use(passport.initialize());

const authRoute = require("./auth/auth.route");
app.use("/api/v1/auth", authRoute);

//Project and co. routes
const projectRoute = require("./projects/projects.route");
const taskRoute = require("./tasks/tasks.route");
app.use("/api/v1/project", projectRoute, taskRoute);

module.exports = app;