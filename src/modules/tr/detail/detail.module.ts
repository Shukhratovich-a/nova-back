import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailCategoryModule } from "@modules/tr/detail-category/detail-category.module";
import { DetailTypeModule } from "@modules/tr/detail-type/detail-type.module";
import { DetailDimensionModule } from "@modules/tr/detail-dimension/detail-dimension.module";

import { DetailEntity } from "./detail.entity";

import { DetailController } from "./detail.controller";

import { DetailService } from "./detail.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailEntity], "db_tr"), DetailCategoryModule, DetailTypeModule, DetailDimensionModule],
  controllers: [DetailController],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
