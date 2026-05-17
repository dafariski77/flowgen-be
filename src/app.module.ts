import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DatabaseModule } from "./core/database/database.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { DiagramsModule } from "./modules/diagrams/diagrams.module";
import { ShowcaseModule } from "./modules/showcase/showcase.module";
import { ShowcaseCategoryModule } from "./modules/showcase-category/showcase-category.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PaymentsModule,
    DiagramsModule,
    ShowcaseModule,
    ShowcaseCategoryModule,
  ],
})
export class AppModule {}
