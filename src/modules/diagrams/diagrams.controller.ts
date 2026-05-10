import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { DiagramsService } from "./diagrams.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Diagrams")
@Controller("diagrams")
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post("generate")
  @ApiOperation({ summary: "Generate a new diagram from text" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Diagram generated successfully.",
  })
  @ApiResponse({
    status: HttpStatus.PAYMENT_REQUIRED,
    description: "Not enough credits.",
  })
  async generate(@Req() req, @Body() body: { prompt: string }) {
    return this.diagramsService.generateDiagram(req.user.sub, body.prompt);
  }

  @Get("history")
  @ApiOperation({ summary: "Get user's diagram history" })
  @ApiResponse({ status: HttpStatus.OK, description: "List of diagrams." })
  async history(@Req() req) {
    return this.diagramsService.getHistory(req.user.sub);
  }
}
