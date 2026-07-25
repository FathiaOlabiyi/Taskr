const {createLogger, format, transports} = require("winston");
const winstonDailyRotateFile = require("winston-daily-rotate-file");
require("dotenv").config();

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({stack:true}),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),

    new transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),

    new transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    }),

    new transports.DailyRotateFile({
      filename: "logs/warn-%DATE%.log",
      level: "warn",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    })
  ],

  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: "logs/exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD"
    })
  ],

  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename: "logs/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD"
    })
  ]
});

module.exports = logger;