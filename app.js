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

app.get("/", (req, res) => {
    logger.info("Accessed Home Page")
    res.status(200).json("Welcome to Taskr Homepage")
});
//agenda

const agenda = require("./config/agenda");
require("./invitations/invitations.utils");
(async () => {
  try {
    await agenda.start();
    console.log("Agenda started");
  } catch (error) {
    console.error(error);
  }
})();

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

const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
