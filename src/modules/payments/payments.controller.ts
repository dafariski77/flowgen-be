import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Initiate checkout for Pro Tier" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Checkout URL generated successfully.",
  })
  async checkout(@Req() req) {
    // req.user has the jwt payload (sub is userId)
    return this.paymentsService.checkout(req.user.sub);
  }

  @Post("webhook")
  @ApiOperation({ summary: "Midtrans Webhook Callback" })
  @ApiResponse({ status: HttpStatus.OK, description: "Webhook processed." })
  async handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
