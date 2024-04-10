import { DataSource } from "typeorm";
import { join, sep } from "path";

const entitiesPath = join(process.cwd(), sep, "src", sep, "models", sep, "**/*{.js,.ts}");

export const appDataSrc = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  database: process.env.DB_NAME,
  entities: [entitiesPath],
  synchronize: true,
  logging: true,
});
