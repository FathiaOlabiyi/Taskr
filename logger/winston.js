const winston = require("winston");
const path = require("path");

const filepath = path.join(process.cwd(), "logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: path.join(filepath, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(filepath, "combined.log"),
    }),
  ]
});


logger.info("Hello, World"); 
logger.error(new Error("an error")); 


// module.exports = logger; 