import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";

import { appDataSrc, logger } from "./core";

const server = http.createServer(app);
const port = process.env.PORT || 3000;

async function bootStrap(): Promise<void> {
  try {
    await appDataSrc.initialize();
    logger.info("The database has been initialized.");
    server.listen(port, () => {
      logger.info(`server is starting on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

bootStrap();
