import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailTypeEntity } from "./detail-type.entity";

import { DetailTypeController } from "./detail-type.controller";

import { DetailTypeService } from "./detail-type.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailTypeEntity], "db_eg")],
  controllers: [DetailTypeController],
  providers: [DetailTypeService],
  exports: [DetailTypeService],
})
export class DetailTypeModule {}
