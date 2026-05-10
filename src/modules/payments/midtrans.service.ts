import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as midtransClient from "midtrans-client";

@Injectable()
export class MidtransService {
  private snap: any;
  private core: any;

  constructor(private readonly configService: ConfigService) {
    const isProduction =
      this.configService.get<string>("MIDTRANS_IS_PRODUCTION") === "true";
    const serverKey = this.configService.get<string>("MIDTRANS_SERVER_KEY");
    const clientKey = this.configService.get<string>("MIDTRANS_CLIENT_KEY");

    this.snap = new midtransClient.Snap({
      isProduction,
      serverKey: serverKey || "dummy_server_key",
      clientKey: clientKey || "dummy_client_key",
    });

    this.core = new midtransClient.CoreApi({
      isProduction,
      serverKey: serverKey || "dummy_server_key",
      clientKey: clientKey || "dummy_client_key",
    });
  }

  async createSnapTransaction(parameter: any) {
    return await this.snap.createTransaction(parameter);
  }

  async transactionStatus(orderId: string) {
    return await this.core.transaction.status(orderId);
  }
}
