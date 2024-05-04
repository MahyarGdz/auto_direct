export interface ISmsResponse {
  status: number;
  message: string;
  data: {
    messageId: number;
    cost: number;
  };
}
