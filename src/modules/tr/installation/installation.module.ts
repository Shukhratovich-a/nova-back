import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductModule } from "@modules/tr/product/product.module";

import { InstallationEntity } from "./installation.entity";

import { InstallationController } from "./installation.controller";

import { InstallationService } from "./installation.service";

@Module({
  imports: [TypeOrmModule.forFeature([InstallationEntity], "db_tr"), forwardRef(() => ProductModule)],
  controllers: [InstallationController],
  providers: [InstallationService],
  exports: [InstallationService],
})
export class InstallationModule {}
