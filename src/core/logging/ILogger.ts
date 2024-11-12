export interface ILogger {
  info(message: any, context?: string, ...data: any[]): void;
  error(message: string, trace?: any, context?: string): void;
  warn(message: string, context?: string, ...optionalParams: any[]): void;
  debug(message: string, context?: string, ...optionalParams: any[]): void;
  verbose(message: string, context?: string, ...optionalParams: any[]): void;
}
