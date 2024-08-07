import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { CronService } from "./cron.service";

@Module({
  imports: [HttpModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
