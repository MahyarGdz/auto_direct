declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;

    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    JWT_SECRET: string;

    SMS_API_KEY: string;
    SMS_ENDPOINT_VERIFY: string;
    SMS_TEMPLATEID: string;
  }
}
