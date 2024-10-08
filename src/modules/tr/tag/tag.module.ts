import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagEntity } from "./tag.entity";

import { TagController } from "./tag.controller";

import { TagService } from "./tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity], "db_tr")],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
