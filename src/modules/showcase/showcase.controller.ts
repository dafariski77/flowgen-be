import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { ShowcaseService } from "./showcase.service";
import { CreateShowcaseDto } from "./dto/create-showcase.dto";
import { UpdateShowcaseDto } from "./dto/update-showcase.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Showcases")
@Controller("showcases")
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  // ========================
  // PUBLIC ENDPOINTS
  // ========================

  @Get()
  @ApiOperation({ summary: "Get all showcases (public)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of all showcases with category info.",
  })
  async findAll() {
    return this.showcaseService.findAll();
  }

  @Get("detail/:slug")
  @ApiOperation({ summary: "Get showcase detail by slug (public)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Showcase detail with category and diagram history.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Showcase not found.",
  })
  async findBySlug(@Param("slug") slug: string) {
    return this.showcaseService.findBySlug(slug);
  }

  // ========================
  // PROTECTED ENDPOINTS
  // ========================

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new showcase" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Showcase created successfully.",
  })
  async create(@Req() req, @Body() dto: CreateShowcaseDto) {
    return this.showcaseService.create(dto, req.user.sub);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a showcase" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Showcase updated successfully.",
  })
  async update(@Param("id") id: string, @Body() dto: UpdateShowcaseDto) {
    return this.showcaseService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a showcase" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Showcase deleted successfully.",
  })
  async remove(@Param("id") id: string) {
    return this.showcaseService.remove(id);
  }
}
