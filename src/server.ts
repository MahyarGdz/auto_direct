import { config } from "dotenv";
config();
import { Container } from "inversify";
import { ExpressApp } from "./app";
import { Logger } from "./core";

import { appDataSrc } from "./core";

const PORT = parseInt(process.env.PORT || "3000");
const logger = new Logger();
async function bootStrap() {
  try {
    const container = new Container({ defaultScope: "Singleton" });
    const app = new ExpressApp(container, PORT);
    await appDataSrc.initialize();
    logger.info("The database has been initialized.");
    app.start();
  } catch (error) {
    logger.error("Error starting the server.", error);
    process.exit(1);
  }
}

bootStrap();
