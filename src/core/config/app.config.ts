import { IAppOptions } from "../../common";

export const appOptions: IAppOptions = {
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
