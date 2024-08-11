import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailCategoryModule } from "@modules/eg/detail-category/detail-category.module";
import { DetailTypeModule } from "@modules/eg/detail-type/detail-type.module";
import { DetailDimensionModule } from "@modules/eg/detail-dimension/detail-dimension.module";

import { DetailEntity } from "./detail.entity";

import { DetailController } from "./detail.controller";

import { DetailService } from "./detail.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailEntity], "db_eg"), DetailCategoryModule, DetailTypeModule, DetailDimensionModule],
  controllers: [DetailController],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
