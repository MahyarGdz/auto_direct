import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { appDataSrc } from "./core";

async function bootStrap(): Promise<void> {
  try {
    await appDataSrc.initialize();
    console.log(`the database has been initialized.`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

bootStrap();
