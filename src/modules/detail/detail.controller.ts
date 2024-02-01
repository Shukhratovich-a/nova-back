import { Controller } from "@nestjs/common";

import { DetailService } from "./detail.service";

@Controller("detail")
export class DetailController {
  constructor(private readonly detailService: DetailService) {}
}
