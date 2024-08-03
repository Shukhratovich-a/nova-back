import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

const locales = ["ru", "en", "tr", "ar", ""];

@Injectable()
export class CronService {
  private requestCount = 0;
  private endpoint = "";
  private readonly maxRequests = 5;

  constructor(private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    if (this.requestCount >= this.maxRequests) {
      return;
    }

    try {
      for (const locale of locales) {
        await lastValueFrom(this.httpService.get(`${process.env.DOMAIN}/${locale}${this.endpoint}`));
        console.log("Request successful");
      }

      this.requestCount++;
    } catch (error) {
      console.error("Error sending request");

      this.requestCount++;
    }
  }

  resetRequestCount() {
    this.requestCount = 0;
  }

  sendRequest(url: string) {
    this.requestCount = 0;
    this.endpoint = url;
  }
}
