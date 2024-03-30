import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailCategoryModule } from "@modules/detail-category/detail-category.module";
import { DetailTypeModule } from "@modules/detail-type/detail-type.module";
import { DetailDimensionModule } from "@modules/detail-dimension/detail-dimension.module";

import { DetailEntity } from "./detail.entity";

import { DetailController } from "./detail.controller";

import { DetailService } from "./detail.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailEntity]), DetailCategoryModule, DetailTypeModule, DetailDimensionModule],
  controllers: [DetailController],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
