import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from "class-validator";

export class CreateShowcaseDto {
  @ApiProperty({
    description: "Showcase title",
    example: "Global Payment Gateway Architecture",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: "URL-friendly slug",
    example: "global-payment-gateway-architecture",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({
    description: "Showcase description",
    example:
      "A high-availability microservices architecture for global payments.",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Thumbnail image URL",
    example: "https://example.com/thumbnail.png",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  thumbnail: string;

  @ApiProperty({
    description: "ID of the source diagram from history",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  @IsNotEmpty()
  diagramHistoryId: string;

  @ApiProperty({
    description: "ID of the showcase category",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: "The AI prompt used to generate the diagram",
    example:
      "Design a high-availability microservices payment gateway architecture.",
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({
    description: "Engine version",
    example: "PROMPT_ENGINE_v4.2",
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  engineVersion?: string;

  @ApiPropertyOptional({
    description: "Logic flow explanation",
  })
  @IsString()
  @IsOptional()
  logicFlowDescription?: string;

  @ApiPropertyOptional({
    description: "Security layer explanation",
  })
  @IsString()
  @IsOptional()
  securityLayerDescription?: string;

  @ApiProperty({
    description: "Diagram type",
    example: "Architecture",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  diagramType: string;

  @ApiPropertyOptional({
    description: "Number of nodes in the diagram",
    example: 24,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  nodeCount?: number;

  @ApiPropertyOptional({
    description: "Complexity level (1-4)",
    example: 3,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(4)
  complexityLevel?: number;

  @ApiPropertyOptional({
    description: "Estimated credits to remix",
    example: 5,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedCredits?: number;

  @ApiPropertyOptional({
    description: "Build version tag",
    example: "STABLE_BUILD_V2",
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  buildVersion?: string;
}
