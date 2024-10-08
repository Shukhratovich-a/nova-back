import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagEntity } from "./tag.entity";

import { TagController } from "./tag.controller";

import { TagService } from "./tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity], "db_eg")],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
