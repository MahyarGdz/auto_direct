export interface IErrorResponse {
  status: number;
  success: boolean;
  error: {
    message: string;
    details: string[];
  };
}
