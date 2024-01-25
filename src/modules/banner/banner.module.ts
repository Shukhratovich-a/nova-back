import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BannerContentEntity, BannerEntity } from "./banner.entity";

import { BannerController } from "./banner.controller";

import { BannerService } from "./banner.service";

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity, BannerContentEntity])],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
