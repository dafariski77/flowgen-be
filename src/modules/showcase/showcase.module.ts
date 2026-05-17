import { Module } from "@nestjs/common";
import { ShowcaseService } from "./showcase.service";
import { ShowcaseController } from "./showcase.controller";
import { DatabaseModule } from "../../core/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ShowcaseController],
  providers: [ShowcaseService],
  exports: [ShowcaseService],
})
export class ShowcaseModule {}
