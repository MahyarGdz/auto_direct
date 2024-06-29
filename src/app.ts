import "reflect-metadata";
import { Server } from "http";
import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Container } from "inversify";
import morgan from "morgan";
import { InversifyExpressServer } from "inversify-express-utils";

import { Logger, errorHandler, lastHandler, notFoundHandler, appOptions, Authenticate } from "./core";
import { containerModules } from "./IOC/ioc.config";
//import controller to generate metadata
import "./modules/auth/auth.controller";
import "./modules/facebook/facebook.controller";

const logger = new Logger();

export class ExpressApp {
  private readonly _container: Container;
  private readonly _port: number;

  constructor(container: Container, port: number) {
    this._container = container;
    this._port = port;
    this.loadModules();
  }
  private async loadModules() {
    return await this._container.loadAsync(containerModules);
  }

  public start(): Server {
    const server = new InversifyExpressServer(this._container, null, { rootPath: "/api" });

    return server
      .setConfig((app) => this.setMiddleware(app))
      .setErrorConfig((app) => this.catchError(app))
      .build()
      .listen(this._port, () => {
        logger.info(`server is starting on http://localhost:${this._port}`);
      });
  }

  private catchError(app: Application) {
    app.use(notFoundHandler);
    app.use(errorHandler);
    app.use(lastHandler);
  }

  private setMiddleware(app: Application) {
    //remove x-powered-by header from response
    app.disable("x-powered-by");
    /**
     * trust for reverse proxy to get correct ip addresse of user
     */
    app.set("trust proxy", 1);
    // app.get("/ip", (request, response) => response.send(request.ip));

    /**
     * compress the response
     */
    app.use(compression());
    /**
     * configure body parser
     */
    app.use(express.json());
    /**
     * configure morgan for http logging
     */
    app.use(morgan("common"));
    /**
     * configure helmet
     */
    app.use(helmet(appOptions.helmet));
    /**
     * configure cors
     */
    app.use(cors(appOptions.cors));
    /**
     * configure rate limit
     */
    app.use(`/api/`, rateLimit(appOptions.rate));
    /**
     * configure passport
     */
    const authenticate = this._container.get(Authenticate);
    app.use(authenticate.initialize());
    authenticate.plug();
  }
}
