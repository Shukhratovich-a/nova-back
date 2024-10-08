import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContactEntity } from "./contact.entity";

import { ContactController } from "./contact.controller";

import { ContactService } from "./contact.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity], "db_eg")],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
