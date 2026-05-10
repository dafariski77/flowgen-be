import { Global, Module } from "@nestjs/common";
import { drizzleProvider } from "./drizzle";

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DatabaseModule {}
