import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BannerEntity } from "./banner.entity";

import { BannerController } from "./banner.controller";

import { BannerService } from "./banner.service";

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity], "db_tr")],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
