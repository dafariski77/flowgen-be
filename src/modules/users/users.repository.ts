import { Injectable, Inject } from "@nestjs/common";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../core/schemas/user";
import { usersTable } from "../../core/schemas/user";
import { eq } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";

type UserInsert = InferInsertModel<typeof usersTable>;

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string) {
    const users = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return users[0] || null;
  }

  async create(userData: UserInsert) {
    const [newUser] = await this.db
      .insert(usersTable)
      .values(userData)
      .returning();
    return newUser;
  }
}
