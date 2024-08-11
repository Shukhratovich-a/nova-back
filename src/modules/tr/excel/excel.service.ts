import { Injectable } from "@nestjs/common";

import { join } from "path";
import * as ExcelJS from "exceljs";

import { ProductService } from "@modules/tr/product/product.service";
import { DetailTypeService } from "@modules/tr/detail-type/detail-type.service";

import { EXCEL_HEADERS } from "./excel.constants";

@Injectable()
export class ExcelService {
  constructor(private readonly productService: ProductService, private readonly detailTypeService: DetailTypeService) {}

  async generateProductsExcel() {
    const products = await this.productService.findAllOrderCategory();
    const detailTypes = await this.detailTypeService.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      ...EXCEL_HEADERS,
      ...detailTypes.map((type) => ({ name: type.titleTr, key: type.id.toString(), width: 20 })),
    ];

    worksheet.addRow([...EXCEL_HEADERS.map((header) => header.name), ...detailTypes.map((type) => type.titleTr)]);

    const productRows = products.map((product) => {
      const result = [
        product.code,

        product.subcategory.category.titleTr,
        product.subcategory.titleTr,
        product.titleTr,

        product.subcategory.category.titleEn,
        product.subcategory.titleEn,
        product.titleEn,

        product.subcategory.category.titleRu,
        product.subcategory.titleRu,
        product.titleRu,
      ];

      detailTypes.forEach((type) => {
        const currentDetail = product.details
          .filter((detail) => detail.type.id === type.id)
          .map((detail) => detail.valueEn)
          .join("\n");

        result.push(currentDetail);
      });

      return result;
    });

    productRows.forEach((row) => worksheet.addRow(row));

    worksheet.eachRow((row) => {
      row.eachCell(
        (cell) => (
          (cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }),
          (cell.font = { name: "Calibri", size: 14 })
        ),
      );
    });

    worksheet.getRow(1).eachCell((cell) => (cell.font = { name: "Calibri", size: 14, bold: true }));

    const filePath = join(process.cwd(), "uploads", `products_${new Date().getTime()}.xlsx`);

    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
}
