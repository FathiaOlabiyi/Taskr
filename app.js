const express = require("express");
const db = require("./config/db");
const passport = require("passport");
require("dotenv").config();

const app = express();
app.use(express.json());

//connect to database
db.connection();

//logger
const logger = require("./logger/winston");

app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;

        if(res.statusCode >= 500) {
            logger.error("HTTP Request Error", {
              method: req.method,
              statusCode: res.statusCode,
              duration: `${duration}ms`,
            });
        } else if(res.statusCode >= 400) {
            logger.warn("Request Warning", {
              method: req.method,
              statusCode: res.statusCode,
              duration: `${duration}ms`,
            });
        }else {
            logger.info("Incoming request", {
              method: req.method,
              statusCode: res.statusCode,
              duration: `${duration}ms`,
            });
        }
    });

    next();
});

app.get("/homepage", (req, res) => {
    logger.info("Accessed Home Page")
    res.status(200).json("Welcome to Task/Project Management API Homepage")
});

// // admin routes
// const rolesRoute = require("./Admin/roles.route");
// const rolePermissionRoute = require("./Admin/role-permission.route");
// app.use("/api/v1/admin/role", rolesRoute, rolePermissionRoute);

// const permissionRoute = require("./Admin/permissions.route");
// app.use("/api/v1/admin/permission", permissionRoute);


//User routes
app.use(passport.initialize());

const authRoute = require("./auth/auth.route");
app.use("/api/v1/auth", authRoute);

const userRoute = require("./users/users.route");
app.use("/api/v1/user", userRoute);

//Project and co. routes
const projectRoute = require("./projects/projects.route");
const taskRoute = require("./tasks/tasks.route");
const invitationRoute = require("./invitations/invitations.route");
const memberRoute = require("./members/members.route");
app.use("/api/v1/project", projectRoute, taskRoute, invitationRoute, memberRoute);

module.exports = app;