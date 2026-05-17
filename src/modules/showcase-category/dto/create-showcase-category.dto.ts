import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateShowcaseCategoryDto {
  @ApiProperty({
    description: "Category name",
    example: "Infrastructure",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: "URL-friendly slug",
    example: "infrastructure",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;
}
