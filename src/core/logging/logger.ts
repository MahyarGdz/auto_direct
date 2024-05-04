import winston, { Logger as WinstonLogger } from "winston";
import { injectable } from "inversify";
import { ILogger } from "../../common";
const { combine, timestamp, json, align, colorize, simple, printf } = winston.format;

@injectable()
export class Logger implements ILogger {
  logger: WinstonLogger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      transports: [
        new winston.transports.File({
          level: "info",
          filename: "logs/combined.log",
          format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), json({ space: 4 }), align()),
          handleExceptions: true,
        }),
        new winston.transports.File({
          level: "error",
          filename: "logs/error.log",
          format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), json({ space: 4 }), align()),
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          level: "debug",
          format: combine(
            simple(),
            timestamp(),
            colorize(),
            printf(({ level, message, timestamp }) => {
              return `\x1b[35m[${timestamp}] => ${level}\x1b[0m: \x1b[33m${message}\x1b[0m`;
            }),
          ),
          handleExceptions: true,
        }),
      );
    }
  }

  public info(message: any, ...data: any[]) {
    this.logger.info(message, ...data);
  }

  public error(message: any, ...data: any[]) {
    this.logger.error(message, ...data);
  }

  public debug(message: any, ...data: any[]) {
    this.logger.debug(message, ...data);
  }

  public warn(message: any, ...data: any[]) {
    this.logger.warn(message, ...data);
  }
}
