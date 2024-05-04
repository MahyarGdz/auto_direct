import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import passport from "passport";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { options as AppOptions } from "./core/config/app.config";
import { errorHandler, lastHandler, notFoundHandler, jwtStrategy } from "./core";
import { appDataSrc, Logger } from "./core";
import { AppRouter } from "./core/app/app.router";

import container from "./IOC/ioc.config";

const port = process.env.PORT || 3000;

const logger = new Logger();
async function bootStrap(): Promise<void> {
  try {
    const app: Application = express();
    //remove x-powered-by header from response
    app.disable("x-powered-by");
    //compress the response

    app.use(compression());
    /**
     * configure body parser
     */
    app.use(express.json());
    /**
     * configure morgan for http logging
     */
    app.use(morgan("dev"));
    /**
     * configure helmet
     */
    app.use(helmet(AppOptions.helmet));
    /**
     * configure cors
     */
    app.use(cors(AppOptions.cors));
    /**
     * configure rate limit
     */
    app.use(`/api/`, rateLimit(AppOptions.rate));
    /**
     * configure passport
     */
    app.use(passport.initialize());
    passport.use("jwt", jwtStrategy);
    /**
     * configure app routes
     */
    const appRouter = container.get(AppRouter);
    appRouter.initRoutes(app);
    /**
     * configure error handler
     */
    app.use(notFoundHandler);
    app.use(errorHandler);
    app.use(lastHandler);

    /**
     * connect database
     **/
    await appDataSrc.initialize();

    logger.info("The database has been initialized.");
    app.listen(port, () => {
      logger.info(`server is starting on http://localhost:${port}`);
    });
  } catch (error) {
    // logger.error("Error starting the server", error);
    console.log(error);

    process.exit(1);
  }
}

bootStrap();
