import express, { Application } from "express";
import passport from "passport";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, lastHandler, notFoundHandler, jwtStrategy } from "./core";
import AuthRouter from "./modules/auth/auth.routes";

const app: Application = express();

app.disable("x-powered-by");

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
//initalize passport
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

//add the route endpoint here
app.use("/auth", AuthRouter);
//

app.use(notFoundHandler);
app.use(errorHandler);
app.use(lastHandler);

export default app;
