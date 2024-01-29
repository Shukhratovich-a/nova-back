import { Module } from "@nestjs/common";

import { FileModule } from "./file/file.module";
import { BannerModule } from "./banner/banner.module";
import { CategoryModule } from "./category/category.module";
import { SubcategoryModule } from "./subcategory/subcategory.module";
import { ProductModule } from "./product/product.module";
import { ContactModule } from "./contact/contact.module";
import { CertificateModule } from "./certificate/certificate.module";

@Module({
  imports: [
    FileModule,
    BannerModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    ContactModule,
    CertificateModule,
  ],
})
export class Modules {}
