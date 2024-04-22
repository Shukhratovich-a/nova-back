import * as sharp from "sharp";
import { join, resolve } from "path";

import { LanguageEnum } from "@/enums/language.enum";

import { ProductDto } from "@modules/product/dtos/product.dto";

const logo = `<svg style="box-sizing:border-box;display:block;margin:0 auto 15px" width="249" height="70" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)" fill="#1B5A7D"><path d="M37.082 29.129v10.274a2.797 2.797 0 0 0 2.827 2.823 2.797 2.797 0 0 0 2.827-2.823v-10.5a13.407 13.407 0 0 0-13.458-13.435 13.407 13.407 0 0 0-13.457 13.435v24.839c0 .677-.566 1.016-1.018 1.016-1.357 0-8.934-8.694-8.934-20.435 0-15.807 12.892-28.678 28.725-28.678 2.488 0 5.315.452 5.315.452a2.797 2.797 0 0 0 2.827-2.823c0-1.468-1.018-2.597-2.375-2.822C38.44.112 36.516 0 34.594 0 15.708 0 .102 15.58.102 34.435c0 17.726 13.683 29.13 17.302 29.13 2.149 0 4.184-1.694 4.184-4.178V28.903c0-4.29 3.506-7.677 7.69-7.677 4.41 0 7.804 3.613 7.804 7.903Z"/><path d="M51.783 5.306C49.634 5.306 47.6 7 47.6 9.484v30.484c0 4.29-3.506 7.677-7.69 7.677-4.298 0-7.69-3.613-7.69-7.903V29.468a2.797 2.797 0 0 0-2.828-2.823 2.797 2.797 0 0 0-2.827 2.823v10.5c0 7.338 5.994 13.435 13.458 13.435A13.406 13.406 0 0 0 53.48 39.968V15.129c0-.677.566-1.016 1.018-1.016 1.357 0 8.934 8.694 8.934 20.435 0 15.694-13.005 28.678-28.837 28.678-2.488 0-5.316-.452-5.316-.452a2.797 2.797 0 0 0-2.827 2.823c0 1.468 1.018 2.597 2.375 2.822 1.923.34 3.845.452 5.768.452 18.998 0 34.492-15.58 34.492-34.435.113-17.726-13.571-29.13-17.303-29.13Zm52.7 26.759c0-3.5-1.696-5.759-4.411-5.759-2.827 0-4.523 2.146-4.523 5.759v23.032H82.996V32.065c0-10.5 5.994-18.29 17.076-18.29 11.083 0 16.964 7.79 16.964 18.29v23.032h-12.553V32.065Zm18.207 2.37c0-11.629 9.613-21.112 20.469-21.112 10.97 0 20.582 9.596 20.582 21.112 0 11.63-9.612 21.226-20.582 21.226-10.969 0-20.469-9.596-20.469-21.226Zm12.553 0c0 4.742 3.393 8.581 7.916 8.581 4.637 0 7.916-3.839 7.916-8.58 0-4.63-3.279-8.581-7.916-8.581-4.523 0-7.916 3.951-7.916 8.58Zm48.741 21.226c-7.124 0-9.047-5.532-10.517-11.516l-8.142-30.37h13.118l5.541 26.644h.113l5.202-26.645h13.345l-8.821 30.371c-1.47 5.08-3.393 11.516-9.839 11.516Zm51.682-19.645c0-7.113-3.28-10.613-9.273-10.613-4.75 0-9.048 3.726-9.048 8.807 0 6.21 4.411 9.37 8.708 9.37 2.601 0 4.863-.564 6.22-1.128v10.951c-2.375 1.807-5.202 2.371-8.934 2.371-8.368 0-19.112-7.226-19.112-21.113 0-12.08 9.16-21.226 21.826-21.226 12.327 0 22.505 6.775 22.505 19.646v22.242h-13.005V36.016h.113ZM86.162 65.152c-.226.226-.678.339-1.244.339h-1.017v1.693h-1.018V62.33h2.035c.453 0 .905.113 1.131.34.34.225.453.677.453 1.128.113.678 0 1.016-.34 1.355Zm-.791-1.806c-.113-.113-.34-.113-.566-.113h-.904V64.7h1.017a.865.865 0 0 0 .566-.225.862.862 0 0 0 .226-.565c-.113-.226-.226-.452-.34-.564Zm7.35-1.017h1.018v4.065h2.375v.79h-3.392V62.33Zm9.387 0h1.018v3.049c0 .338 0 .564.113.79.113.226.339.452.791.452.453 0 .679-.113.792-.452.113-.113.113-.452.113-.79v-3.049h1.018v3.049c0 .564-.113.903-.226 1.242-.34.564-.905.79-1.697.79-.791 0-1.357-.226-1.696-.79-.113-.339-.226-.678-.226-1.242v-3.049Zm13.344 0h1.471v4.855h-.905v-4.177l-.905 4.064h-1.018l-.904-4.064v4.177h-.905V62.33h1.47l.905 3.84.791-3.84Zm11.196.565c.113.226.226.452.226.79 0 .339-.113.565-.226.678-.113.113-.226.226-.339.226.226.112.452.225.565.451.113.226.227.452.227.677 0 .34-.114.565-.227.79l-.339.34a.864.864 0 0 1-.565.225c-.227 0-.453.113-.679.113h-2.149V62.33h2.375c.453 0 .905.226 1.131.565Zm-2.601.339v1.129h1.131c.226 0 .339 0 .565-.113.114-.113.227-.226.227-.452s-.113-.339-.227-.451c-.113 0-.339-.113-.565-.113h-1.131Zm0 1.806v1.355h1.131c.226 0 .339 0 .452-.113a.62.62 0 0 0 .34-.565.62.62 0 0 0-.34-.564c-.113 0-.226-.113-.452-.113h-1.131Zm10.065 2.145h-1.018V62.33h1.018v4.855Zm6.22-4.855h1.018l1.922 3.387V62.33h.905v4.855h-1.018l-1.922-3.5v3.5h-.905V62.33Zm13.457 1.581c-.113-.339-.226-.564-.565-.677-.113-.113-.339-.113-.565-.113-.34 0-.679.113-.905.451-.226.339-.339.79-.339 1.355s.113 1.016.452 1.242c.226.226.565.339.905.339.339 0 .565-.113.791-.339.226-.226.34-.452.453-.79h-1.131v-.79h2.035v2.596h-.678l-.113-.564c-.226.225-.34.338-.566.451a2.26 2.26 0 0 1-1.018.226c-.678 0-1.13-.226-1.583-.677-.452-.452-.678-1.016-.678-1.807 0-.79.226-1.468.678-1.92.453-.45 1.018-.676 1.697-.676.565 0 1.13.112 1.47.451.339.339.565.678.678 1.13h-1.018v.112Zm15.154 1.806c0 .226.113.34.227.452.113.226.452.339.904.339.226 0 .453 0 .566-.113.339-.113.452-.339.452-.565 0-.112-.113-.338-.226-.338-.113-.113-.339-.113-.679-.226l-.565-.113c-.566-.113-.905-.226-1.018-.339-.339-.225-.452-.564-.452-1.016 0-.451.113-.79.452-1.129.339-.339.792-.451 1.357-.451.566 0 .905.112 1.357.451.339.226.566.678.566 1.242h-1.018c0-.339-.113-.452-.339-.677-.114-.113-.34-.113-.566-.113-.226 0-.452 0-.678.113-.113.113-.227.225-.227.451s.114.339.227.339c.113.113.339.113.678.226l.792.226c.339.113.678.225.791.338.34.226.453.565.453 1.016 0 .452-.226.79-.566 1.13-.339.338-.791.451-1.47.451-.678 0-1.131-.113-1.47-.452-.339-.338-.565-.677-.565-1.242h1.017Zm12.666 1.13c-.339.338-.904.564-1.583.564-.679 0-1.244-.226-1.583-.564-.453-.452-.679-1.13-.679-2.033s.226-1.58.679-2.032c.339-.339.904-.564 1.583-.564.679 0 1.244.225 1.583.564.453.452.679 1.129.679 2.032.113.79-.113 1.468-.679 2.032Zm-.565-.79c.226-.34.339-.678.339-1.243 0-.564-.113-1.016-.339-1.242-.226-.338-.566-.451-.905-.451-.339 0-.678.113-.905.451-.226.339-.339.678-.339 1.242 0 .565.113 1.016.339 1.242.227.339.566.452.905.452.339 0 .679-.113.905-.452Zm7.351-3.727h1.017v4.065h2.375v.79h-3.392V62.33Zm9.386 0h1.018v3.049c0 .338 0 .564.113.79.113.226.339.452.791.452.453 0 .679-.113.792-.452.113-.113.113-.452.113-.79v-3.049h1.018v3.049c0 .564-.113.903-.226 1.242-.339.564-.905.79-1.697.79-.791 0-1.357-.226-1.696-.79-.113-.339-.226-.678-.226-1.242v-3.049Zm13.684.904h-1.47v3.951h-1.018V63.12h-1.47v-.903h3.958v1.016Zm6.785 3.951h-1.018V62.33h1.018v4.855Zm9.952-.338c-.339.338-.905.564-1.583.564-.679 0-1.244-.226-1.584-.564-.452-.452-.678-1.13-.678-2.033s.226-1.58.678-2.032c.34-.339.905-.564 1.584-.564.678 0 1.244.225 1.583.564.452.452.678 1.129.678 2.032.113.79-.226 1.468-.678 2.032Zm-.566-.79c.227-.34.34-.678.34-1.243 0-.564-.113-1.016-.34-1.242-.226-.338-.565-.451-.904-.451-.453 0-.679.113-.905.451-.226.339-.339.678-.339 1.242 0 .565.113 1.016.339 1.242.226.339.565.452.905.452.339 0 .565-.113.904-.452Zm7.351-3.727h1.018l1.922 3.387V62.33h.905v4.855h-1.018l-1.922-3.5v3.5h-.905V62.33Zm10.857 3.387c0 .226.113.34.226.452.113.226.452.339.905.339.226 0 .452 0 .565-.113.339-.113.452-.339.452-.565 0-.112-.113-.338-.226-.338-.113-.113-.339-.113-.678-.226l-.566-.113c-.565-.113-.905-.226-1.018-.339-.339-.225-.452-.564-.452-1.016 0-.451.113-.79.452-1.129.34-.339.792-.451 1.357-.451.566 0 .905.112 1.358.451.339.226.565.678.565 1.242h-1.018c0-.339-.113-.452-.339-.677-.113-.113-.339-.113-.566-.113-.226 0-.452 0-.678.113-.113.113-.226.225-.226.451s.113.339.226.339c.113.113.339.113.678.226l.792.226c.339.113.679.225.792.338.339.226.452.565.452 1.016 0 .452-.226.79-.565 1.13-.34.338-.792.451-1.471.451-.678 0-1.13-.113-1.47-.452-.339-.338-.565-.677-.565-1.242h1.018Z"/></g><defs><clipPath id="a"><path fill="#fff" transform="translate(.102)" d="M0 0h248.795v70H0z"/></clipPath></defs></svg>`;

const keyWords: Record<LanguageEnum, Record<string, string | number>> = {
  en: {
    card: "PRODUCT CARD",
    code: "Product code",
    title: "Product title",
    description: "Description (Specifications)",
    mainImage: "Main image",
    schemeImage: "Scheme image",
    boxImage: "Box image",
    allRights: "FE LLC Nova Plumbing Solutions ALL RIGHTS RESERVED",
    moreInfo: "For more information please contact with the manufacturer",
    supportLine: "Customers support line",
  },
  ru: {
    card: "ПАСПОРТ ПРОДУКТА",
    code: "Код продукта",
    title: "Название продукта",
    description: "Описание (Технические характеристики)",
    mainImage: "Основное изображение",
    schemeImage: "Схема изображения",
    boxImage: "Изображение упаковки",
    allRights: "FE LLC Nova Plumbing Solutions ВСЕ ПРАВА ЗАЩИЩЕНЫ",
    moreInfo: "Для получения дополнительной информации свяжитесь с производителем",
    supportLine: "Линия поддержки клиентов",
  },
  tr: {
    card: "PRODUCT CARD",
    code: "Product code",
    title: "Product title",
    description: "Description (Specifications)",
    mainImage: "Main image",
    schemeImage: "Scheme image",
    boxImage: "Box image",
    allRights: "FE LLC Nova Plumbing Solutions ALL RIGHTS RESERVED",
    moreInfo: "For more information please contact with the manufacturer",
    supportLine: "Customers support line",
  },
  ar: {
    card: "PRODUCT CARD",
    code: "Product code",
    title: "Product title",
    description: "Description (Specifications)",
    mainImage: "Main image",
    schemeImage: "Scheme image",
    boxImage: "Box image",
    allRights: "FE LLC Nova Plumbing Solutions  ALL RIGHTS RESERVED",
    moreInfo: "For more information please contact with the manufacturer",
    supportLine: "Customers support line",
  },
};

export const pdf = async (dto: ProductDto, language: LanguageEnum) => {
  let mainImage = "";
  let schemeImage = "";
  let boxImage = "";

  if (dto.mainImage) {
    const mainImageBuffer = await sharp(resolve(join(process.cwd(), dto.mainImage)))
      .resize({ width: 195, height: 195, fit: "contain" })
      .toBuffer();
    mainImage = `data:image/jpeg;base64,${mainImageBuffer.toString("base64")}`;
  }

  if (dto.schemeImage) {
    const schemeImageBuffer = await sharp(resolve(join(process.cwd(), dto.schemeImage)))
      .resize({ width: 195, height: 195, fit: "contain" })
      .toBuffer();
    schemeImage = `data:image/jpeg;base64,${schemeImageBuffer.toString("base64")}`;
  }

  if (dto.boxImage) {
    const boxImageBuffer = await sharp(resolve(join(process.cwd(), dto.boxImage)))
      .resize({ width: 195, height: 195, fit: "contain" })
      .toBuffer();
    boxImage = `data:image/jpeg;base64,${boxImageBuffer.toString("base64")}`;
  }

  const details = dto.detailCategories
    .map(
      (category) => `<div style="display: flex; flex-direction: column">
  <div
    style="
      display: flex;
      flex-direction: column;
      padding: 3px;
      font-size: 10px;
      font-weight: 700;
      background-color: #ddebf6;
      line-height: 12px;
      text-align: center;
      border-top: 1px solid #1b5a7d;
    "
  >
    ${category.title}
  </div>

  ${category.details
    .map(
      (detail) => `<div style="display: flex; border-top: 1px solid #1b5a7d">
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 140px;
      padding: 3px;
      font-size: 10px;
      font-weight: 700;
      line-height: 12px;
      text-align: center;
      border-right: 1px solid #1b5a7d;
    "
  >
    ${detail.title}
  </div>
  <div
    style="
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 3px;
      font-size: 10px;
      font-weight: 700;
      line-height: 12px;
      text-align: center;
    "
  >
  ${detail.value} ${detail.dimension ? detail.dimension : ""}
  </div>
</div>`,
    )
    .join("")}
</div>`,
    )
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=595, initial-scale=1.0" />
      <meta name="viewport" content="height=842, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
      <style>
        p {
          margin: 0;
          font-size: 12px;
          line-height: 16px;
        }

        ul,
        ol {
          margin: 0;
          padding: 0;
          padding-left: 25px;
          font-size: 12px;
          line-height: 16px;
        }
      </style>
      <title>${dto.code}</title>
    </head>
    <body>
      <div
        style="
          box-sizing: border-box;
          width: 595px;
          height: 842px;
          padding: 15px 30px;
          font-family: 'Inter', sans-serif;
          color: #1b5a7d;
        "
      >
        ${logo}
  
        <div
          style="box-sizing: border-box; display: flex; flex-direction: column; height: 727px; border: 1px solid #1b5a7d"
        >
          <div
            style="
              box-sizing: border-box;
              padding: 7px;
              font-size: 14px;
              font-weight: 700;
              line-height: 18px;
              text-align: center;
              border-bottom: 1px solid #1b5a7d;
              background-color: #ddebf6;
            "
          >
            ${keyWords[language].card}
          </div>
  
          <div style="box-sizing: border-box; display: flex; flex-grow: 1; border-bottom: 1px solid #1b5a7d">
            <div style="display: flex; flex-direction: column; width: 335px; border-right: 1px solid #1b5a7d">
              <div style="font-size: 10px; line-height: 12px; font-weight: 700; text-align: center">
                <div style="display: flex; border-bottom: 1px solid #1b5a7d">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 135px;
                      flex-shrink: 0;
                      padding: 9px 12px;
                      border-right: 1px solid #1b5a7d;
                      background-color: #ddebf6;
                    "
                  >
                    ${keyWords[language].code}
                  </div>
                  <div
                    style="display: flex; align-items: center; justify-content: center; flex-grow: 1; padding: 2px 12px"
                  >
                    ${dto.code}
                  </div>
                </div>
  
                <div style="display: flex; border-bottom: 1px solid #1b5a7d">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 135px;
                      flex-shrink: 0;
                      padding: 9px 12px;
                      border-right: 1px solid #1b5a7d;
                      background-color: #ddebf6;
                    "
                  >
                    ${keyWords[language].title}
                  </div>
                  <div
                    style="display: flex; align-items: center; justify-content: center; flex-grow: 1; padding: 2px 12px"
                  >
                    ${dto.title}
                  </div>
                </div>
              </div>
  
              <div style="flex-grow: 1">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    padding: 3px;
                    font-size: 10px;
                    font-weight: 700;
                    background-color: #ddebf6;
                    line-height: 12px;
                    text-align: center;
                    border-bottom: 1px solid #1b5a7d;
                  "
                >
                  ${keyWords[language].description}
                </div>
  
                <div style="padding: 10px">
                  ${dto.description}
                </div>
              </div>

              ${details}
  
              
            </div>
  
            <div style="display: flex; flex-direction: column; flex-grow: 1">
              <div style="flex-grow: 1; border-bottom: 1px solid #1b5a7d">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    padding: 3px;
                    font-size: 10px;
                    font-weight: 700;
                    background-color: #ddebf6;
                    line-height: 12px;
                    text-align: center;
                    border-bottom: 1px solid #1b5a7d;
                  "
                >
                  ${keyWords[language].mainImage}
                </div>
  
                <div style="display: flex; justify-content: center; align-items: center; flex-grow: 1">
                  ${mainImage ? `<img style="width: 194px; height: 194px; object-fit: contain" src="${mainImage}" alt="" />` : ""}
                </div>
              </div>
              <div style="flex-grow: 1; border-bottom: 1px solid #1b5a7d">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    padding: 3px;
                    font-size: 10px;
                    font-weight: 700;
                    background-color: #ddebf6;
                    line-height: 12px;
                    text-align: center;
                    border-bottom: 1px solid #1b5a7d;
                  "
                >
                  ${keyWords[language].schemeImage}
                </div>
  
                <div style="display: flex; justify-content: center; align-items: center; flex-grow: 1">
                  ${
                    schemeImage
                      ? `<img style="width: 194px; height: 194px; object-fit: contain" src="${schemeImage}" alt="" />`
                      : ""
                  }
                </div>
              </div>
              <div style="flex-grow: 1">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    padding: 3px;
                    font-size: 10px;
                    font-weight: 700;
                    background-color: #ddebf6;
                    line-height: 12px;
                    text-align: center;
                    border-bottom: 1px solid #1b5a7d;
                  "
                >
                  ${keyWords[language].boxImage}
                </div>
  
                <div style="display: flex; justify-content: center; align-items: center; flex-grow: 1">
                  ${boxImage ? `<img style="width: 194px; height: 194px; object-fit: contain" src="${boxImage}" alt="" />` : ""}
                </div>
              </div>
            </div>
          </div>
  
          <div
            style="
              box-sizing: border-box;
              padding: 5px;
              font-size: 10px;
              font-weight: 700;
              line-height: 12px;
              text-align: center;
              color: #1b5a7d;
              background-color: #ddebf6;
            "
          >
            <div
              style="
                margin-bottom: 2px;
                font-size: 10px;
                font-weight: 700;
                line-height: 12px;
                text-align: center;
                color: #1b5a7d;
              "
            >
              ${keyWords[language].allRights}
            </div>
  
            <div
              style="
                margin-bottom: 2px;
                font-size: 10px;
                font-weight: 700;
                line-height: 12px;
                text-align: center;
                color: #1b5a7d;
              "
            >
              ${keyWords[language].moreInfo}
            </div>
  
            <div style="font-size: 8px; font-weight: 700; line-height: 10px; text-align: center; color: #1b5a7d">
              <a style="color: inherit" href="mailto:info@novaplastik.uz">info@novaplastik.uz</a> - ${
                keyWords[language].supportLine
              } +998933883042
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
};
