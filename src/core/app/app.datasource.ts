import { DataSource } from "typeorm";
import { join } from "path";

export const appDataSrc = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  database: process.env.DB_NAME,
  entities: [join(process.cwd(), "src", "models", "**/*.model{.ts,.js}")],
  migrations: [join(process.cwd(), "src", "models", "migrations", "**/**{.ts,.js}")],
  synchronize: true,
  logging: true,
});
