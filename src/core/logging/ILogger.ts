export interface ILogger {
  info(message: any, ...data: any[]): void;
  error(message: any, ...data: any[]): void;
  debug(message: any, ...data: any[]): void;
  warn(message: any, ...data: any[]): void;
}
