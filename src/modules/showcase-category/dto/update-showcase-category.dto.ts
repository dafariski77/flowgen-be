import { PartialType } from "@nestjs/swagger";
import { CreateShowcaseCategoryDto } from "./create-showcase-category.dto";

export class UpdateShowcaseCategoryDto extends PartialType(
  CreateShowcaseCategoryDto,
) {}
