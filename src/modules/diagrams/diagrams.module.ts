import { Module } from "@nestjs/common";
import { DiagramsService } from "./diagrams.service";
import { DiagramsController } from "./diagrams.controller";
import { DatabaseModule } from "../../core/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
