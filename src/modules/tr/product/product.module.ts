import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductEntity } from "./product.entity";

import { DetailModule } from "@modules/tr/detail/detail.module";
import { SubcategoryModule } from "@modules/tr/subcategory/subcategory.module";
import { PdfModule } from "@modules/tr/pdf/pdf.module";
import { CronModule } from "@modules/tr/cron/cron.module";

import { ProductController } from "./product.controller";

import { ProductService } from "./product.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity], "db_tr"),
    forwardRef(() => SubcategoryModule),
    forwardRef(() => DetailModule),
    forwardRef(() => PdfModule),
    forwardRef(() => CronModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
