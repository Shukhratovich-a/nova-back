import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailCategoryModule } from "@modules/uz/detail-category/detail-category.module";
import { DetailTypeModule } from "@modules/uz/detail-type/detail-type.module";
import { DetailDimensionModule } from "@modules/uz/detail-dimension/detail-dimension.module";

import { DetailEntity } from "./detail.entity";

import { DetailController } from "./detail.controller";

import { DetailService } from "./detail.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailEntity], "db_uz"),
    DetailCategoryModule,
    DetailTypeModule,
    DetailDimensionModule,
    RouterModule.register([{ path: "uz", children: [DetailCategoryModule, DetailTypeModule, DetailDimensionModule] }]),
  ],
  controllers: [DetailController],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
