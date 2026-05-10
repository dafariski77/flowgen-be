import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DatabaseModule } from "./core/database/database.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { DiagramsModule } from "./modules/diagrams/diagrams.module";

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
  ],
})
export class AppModule {}
