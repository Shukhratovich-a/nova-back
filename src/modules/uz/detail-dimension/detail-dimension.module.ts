import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailDimensionEntity } from "./detail-dimension.entity";

import { DetailDimensionController } from "./detail-dimension.controller";

import { DetailDimensionService } from "./detail-dimension.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailDimensionEntity], "db_uz")],
  controllers: [DetailDimensionController],
  providers: [DetailDimensionService],
  exports: [DetailDimensionService],
})
export class DetailDimensionModule {}
