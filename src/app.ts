import express, { Application, Router } from "express";
import passport from "passport";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { errorHandler, lastHandler, notFoundHandler, jwtStrategy } from "./core";
import AuthRouter from "./modules/auth/auth.routes";
import { IAppOptions } from "./common/interfaces/app/IAppOptions";

export class ExpressApp {
  private static instance: ExpressApp;
  public application: Application;
  private routers: Router[];

  private options: IAppOptions = {
    cors: { origin: true, credentials: true, optionsSuccessStatus: 204 },
    helmet: {
      //   contentSecurityPolicy: {
      //     defaultSrc: ["'self'"],
      //     scriptSrc: ["'self'", "'unsafe-inline'"],
      //     sandbox: ["allow-forms", "allow-scripts"],
      //     objectSrc: ["'none'"],
      //     upgradeInsecureRequests: true,
      //   },
      contentSecurityPolicy: false,
      noSniff: true,
      referrerPolicy: { policy: "no-referrer" },
      xDnsPrefetchControl: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      xPermittedCrossDomainPolicies: false,
      originAgentCluster: false,
      xDownloadOptions: false,
    },
    rate: {
      windowMs: 60 * 60 * 1000, // 1 hour
      //   max: 2500,
      message: "Too many requests from this IP, please try again after an hour",
      //   windowMs: 5 * 60 * 1000, // 5 minutes
      max: 60, // Limit each IP to 50 requests per  5
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    },
  };

  private constructor(routers: Router[]) {
    this.application = express();
    this.routers = routers;
  }

  static get(routers: Router[]): ExpressApp {
    if (!ExpressApp.instance) {
      ExpressApp.instance = new ExpressApp(routers);
    }
    return ExpressApp.instance;
  }
  public init(): ExpressApp {
    return this.plugin().setRouter().CatchError();
  }
  //plug the middlewares
  private plugin(): ExpressApp {
    this.application.disable("x-powered-by");
    // this.application.use(express.urlencoded({ extended: true }));
    this.application.use(express.json());
    this.application.use(compression());
    this.application.use(morgan("dev"));
    this.application.use(helmet(this.options.helmet));
    this.application.use(cors(this.options.cors));
    this.application.use(`/api/`, rateLimit(this.options.rate));
    this.application.use(passport.initialize());
    passport.use("jwt", jwtStrategy);

    return this;
  }
  private setRouter(): ExpressApp {
    this.routers.forEach((router) => {
      this.application.use("/api", router);
    });
    return this;
  }

  private CatchError(): ExpressApp {
    this.application.use(notFoundHandler);
    this.application.use(errorHandler);
    this.application.use(lastHandler);

    return this;
  }
}
const routers: Router[] = [AuthRouter];
const app = ExpressApp.get(routers).init().application;

export default app;
