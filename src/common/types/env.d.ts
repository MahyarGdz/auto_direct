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
    JWT_EXPIRE_ACCESS: string;
    JWT_EXPIRE_REFRESH: string;

    SMS_API_KEY: string;
    SMS_ENDPOINT_VERIFY: string;
    SMS_TEMPLATEID: string;

    FB_CLIENT_ID: string;
    FB_CLIENT_SEC: string;
    FB_CALLBACK: string;
    FB_WEBHOOK_VERIFY_TOKEN: string;
  }
}
