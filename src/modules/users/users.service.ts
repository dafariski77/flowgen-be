import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { InferInsertModel } from "drizzle-orm";
import { usersTable } from "../../core/schemas/user";

type UserInsert = InferInsertModel<typeof usersTable>;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(userData: UserInsert) {
    return this.usersRepository.create(userData);
  }
}
