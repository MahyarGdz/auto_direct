import axios, { AxiosRequestConfig } from "axios";
import { BadRequestError } from "../common/error/app.error";
import { ISmsResponse } from "../common/interfaces/IsmsResponse";

export class SMS {
  private static ENDPOINT = process.env.SMS_ENDPOINT_VERIFY || "";
  private static APIKEY = process.env.SMS_API_KEY || "";
  private static TEMPLATEID = process.env.SMS_TEMPLATEID || "";

  static async sendSmsVerifyCode(mobile: string, otpCode: string): Promise<ISmsResponse> {
    const smsData = {
      mobile,
      templateId: SMS.TEMPLATEID,
      parameters: [{ name: "code", value: otpCode }],
    };

    const axiosConfig: AxiosRequestConfig = {
      method: "post",
      url: SMS.ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        ACCEPT: "application/json",
        "x-api-key": SMS.APIKEY,
      },
      data: JSON.stringify(smsData),
    };

    try {
      const { data } = await axios(axiosConfig);
      return data;
    } catch (error) {
      console.log(error);
      throw new BadRequestError("The code was not sent. Please try again");
    }
  }
}
