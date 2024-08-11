import { Module, forwardRef } from "@nestjs/common";

import { ProductModule } from "@modules/uz/product/product.module";
import { DetailTypeModule } from "@modules/uz/detail-type/detail-type.module";

import { ExcelController } from "./excel.controller";

import { ExcelService } from "./excel.service";

@Module({
  imports: [forwardRef(() => ProductModule), forwardRef(() => DetailTypeModule)],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
