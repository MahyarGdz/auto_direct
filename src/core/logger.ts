import winston from "winston";
const { combine, timestamp, json, align } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL,
  format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), json({ space: 4 }), align()),
  transports: [
    new winston.transports.File({
      filename: "logs/all.log",
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);
