import axios from "axios";
import { BadRequestError } from "../common/error/app.error";

export class SMS {
  smsService!: any;
  constructor() {}

  static async sendSmsVerifyCode(mobile: string, otpCode: string) {
    const ENDPOINT = `${process.env.SMS_ENDPOINT_VERIFY}`;
    const APIKEY = `${process.env.SMS_API_KEY}`;
    const templateId = `${process.env.SMS_TEMPLATEID}`;

    // Data
    const SmsData = JSON.stringify({
      mobile: mobile,
      templateId: templateId,
      parameters: [
        {
          name: "code",
          value: otpCode,
        },
      ],
    });

    // Config
    const AxiosConfig = {
      method: "post",
      url: ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        "x-api-key": APIKEY,
      },
      data: SmsData,
    };

    // const response = await axios(AxiosConfig)

    // return response

    axios(AxiosConfig)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        throw new BadRequestError("The code was not sent. Please try again");
      });
  }
}
