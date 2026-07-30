const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taskr",
      version: "1.0.0",
      description: "Backend API for project and task management",
    },
    servers: [
      {
        url: "http://localhost:3200",
      },
    ],
  },
  apis: ["./docs/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
