import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailEntity, DetailContentEntity, DetailCategoryEntity, DetailCategoryContentEntity } from "./detail.entity";

import { DetailController } from "./detail.controller";

import { DetailService } from "./detail.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailEntity, DetailContentEntity, DetailCategoryEntity, DetailCategoryContentEntity]),
  ],
  controllers: [DetailController],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
