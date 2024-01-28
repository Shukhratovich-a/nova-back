import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContactEntity, CoordEntity } from "./contact.entity";

import { ContactController } from "./contact.controller";

import { ContactService } from "./contact.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity, CoordEntity])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
