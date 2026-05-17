import { Module } from "@nestjs/common";
import { ShowcaseCategoryService } from "./showcase-category.service";
import { ShowcaseCategoryController } from "./showcase-category.controller";
import { DatabaseModule } from "../../core/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ShowcaseCategoryController],
  providers: [ShowcaseCategoryService],
  exports: [ShowcaseCategoryService],
})
export class ShowcaseCategoryModule {}
