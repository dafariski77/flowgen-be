import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { ShowcaseCategoryService } from "./showcase-category.service";
import { CreateShowcaseCategoryDto } from "./dto/create-showcase-category.dto";
import { UpdateShowcaseCategoryDto } from "./dto/update-showcase-category.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Showcase Categories")
@Controller("showcase-categories")
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
export class ShowcaseCategoryController {
  constructor(
    private readonly showcaseCategoryService: ShowcaseCategoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all showcase categories" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of showcase categories.",
  })
  async findAll() {
    return this.showcaseCategoryService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a showcase category by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Showcase category details.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found.",
  })
  async findOne(@Param("id") id: string) {
    return this.showcaseCategoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new showcase category" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Category created successfully.",
  })
  async create(@Body() dto: CreateShowcaseCategoryDto) {
    return this.showcaseCategoryService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a showcase category" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category updated successfully.",
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateShowcaseCategoryDto,
  ) {
    return this.showcaseCategoryService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a showcase category" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category deleted successfully.",
  })
  async remove(@Param("id") id: string) {
    return this.showcaseCategoryService.remove(id);
  }
}
